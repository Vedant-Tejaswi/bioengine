import os
import io
import csv
import json

import base64
from typing import List, Dict, Any

import requests
from google import genai
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PyPDF2 import PdfReader
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, Response, PlainTextResponse
from starlette.routing import Route
from starlette.middleware.cors import CORSMiddleware

ROOT = os.path.dirname(__file__)
DATA_CSV = os.path.join(ROOT, 'SB_publication_PMC.csv')
SYS_PROMPT_PATH = os.path.join(ROOT, 'sys_prompt.json')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

try:
	if GEMINI_API_KEY:
		CLIENT = genai.Client(api_key=GEMINI_API_KEY)
	else:
		CLIENT = genai.Client()
except Exception:
	CLIENT = None

def load_system_prompt() -> str:
	try:
		with open(SYS_PROMPT_PATH, 'r', encoding='utf-8') as f:
			j = json.load(f)
			return j.get('role', '') + "\n" + j.get('name', '')
	except Exception:
		return ''


def load_dataset() -> List[Dict[str, str]]:
	rows: List[Dict[str, str]] = []
	try:
		with open(DATA_CSV, newline='', encoding='utf-8') as csvfile:
			reader = csv.DictReader(csvfile)
			for r in reader:
				rows.append({'title': r.get('Title', ''), 'link': r.get('Link', '')})
	except Exception:
		pass
	return rows


SYSTEM_PROMPT = load_system_prompt()
DATASET = load_dataset()


def tokenize(text: str) -> List[str]:
	return [t for t in ''.join(c if c.isalnum() else ' ' for c in text.lower()).split() if t]


def simple_retrieval(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
	qtoks = set(tokenize(query))
	scored = []
	for item in DATASET:
		title = item.get('title', '')
		ttoks = set(tokenize(title))
		overlap = len(qtoks & ttoks)
		score = overlap
		if score > 0:
			scored.append((score, item))
	scored.sort(key=lambda x: x[0], reverse=True)
	return [s[1] for s in scored[:top_k]]


def extract_text_from_pdf_bytes(b: bytes) -> str:
	reader = PdfReader(io.BytesIO(b))
	parts = []
	for p in reader.pages:
		try:
			t = p.extract_text() or ''
		except Exception:
			t = ''
		parts.append(t)
	return '\n'.join(parts)


def call_gemini(prompt: str, max_output_tokens: int = 512) -> str:
	if not CLIENT:
		raise RuntimeError('GenAI client not configured')
	try:
		resp = CLIENT.models.generate_content(model='gemini-2.5-flash', contents=prompt, max_output_tokens=max_output_tokens, temperature=0.2)
	except Exception:
		raise
	if hasattr(resp, 'text') and resp.text:
		return resp.text
	try:
		return str(resp)
	except Exception:
		return ''


async def pdf_question(request: Request) -> Response:
	form = await request.form()
	question = form.get('question') or ''
	file = form.get('file')
	if not file or not question:
		return JSONResponse({'error': 'file and question are required'}, status_code=400)
	body = await file.read()
	pdf_text = extract_text_from_pdf_bytes(body)
	hits = simple_retrieval(question, top_k=6)
	ctx = 'Dataset hits:\n'
	for h in hits:
		ctx += f"- {h.get('title')} ({h.get('link')})\n"
	prompt = f"{SYSTEM_PROMPT}\n{ctx}\nPDF TEXT:\n{pdf_text[:20000]}\nQUESTION:\n{question}\nAnswer using the PDF text and dataset hits. Provide sources where appropriate."
	try:
		answer = call_gemini(prompt, max_output_tokens=800)
	except Exception as e:
		return JSONResponse({'error': str(e)}, status_code=500)
	return JSONResponse({'answer': answer, 'hits': hits})


async def pdf_summarize(request: Request) -> Response:
	form = await request.form()
	file = form.get('file')
	if not file:
		return JSONResponse({'error': 'file is required'}, status_code=400)
	body = await file.read()
	pdf_text = extract_text_from_pdf_bytes(body)
	prompt = f"{SYSTEM_PROMPT}\nSummarize the following PDF concisely (3-6 sentences):\n{pdf_text[:20000]}"
	try:
		summary = call_gemini(prompt, max_output_tokens=400)
	except Exception as e:
		return JSONResponse({'error': str(e)}, status_code=500)
	return JSONResponse({'summary': summary})


async def smiles_view(request: Request) -> Response:
	q = request.query_params.get('smiles')
	if not q:
		return JSONResponse({'error': 'smiles query parameter required'}, status_code=400)
	smiles = q
	cactus = f'https://cactus.nci.nih.gov/chemical/structure/{requests.utils.requote_uri(smiles)}/sdf'
	try:
		r = requests.get(cactus, timeout=30)
		r.raise_for_status()
		sdf = r.text
	except Exception as e:
		return JSONResponse({'error': 'failed to fetch SDF: ' + str(e)}, status_code=500)
	return PlainTextResponse(sdf, media_type='chemical/x-mdl-sdfile')


async def dataset_search(request: Request) -> Response:
	q = request.query_params.get('q')
	if not q:
		return JSONResponse({'results': DATASET})
	results = simple_retrieval(q, top_k=20)
	return JSONResponse({'results': results})


async def graph_correlation(request: Request) -> Response:
	try:
		payload = await request.json()
	except Exception:
		return JSONResponse({'error': 'invalid json'}, status_code=400)
	arrays = payload.get('arrays')
	labels = payload.get('labels') or []
	if not arrays or not isinstance(arrays, list) or len(arrays) < 2:
		return JSONResponse({'error': 'arrays must be a list of at least two numeric lists'}, status_code=400)
	try:
		mat = np.array([np.array(a, dtype=float) for a in arrays])
	except Exception:
		return JSONResponse({'error': 'arrays must be numeric'}, status_code=400)
	if any(len(row) != mat.shape[1] for row in mat):
		return JSONResponse({'error': 'all arrays must have same length'}, status_code=400)
	corr = np.corrcoef(mat)
	fig, ax = plt.subplots(figsize=(6, 5))
	cax = ax.matshow(corr, cmap='coolwarm', vmin=-1, vmax=1)
	fig.colorbar(cax)
	n = corr.shape[0]
	ticks = list(range(n))
	ax.set_xticks(ticks)
	ax.set_yticks(ticks)
	if labels and len(labels) == n:
		ax.set_xticklabels(labels, rotation=90)
		ax.set_yticklabels(labels)
	else:
		ax.set_xticklabels([str(i) for i in ticks])
		ax.set_yticklabels([str(i) for i in ticks])
	for (i, j), val in np.ndenumerate(corr):
		ax.text(j, i, f"{val:.2f}", ha='center', va='center', color='black')
	buf = io.BytesIO()
	fig.tight_layout()
	fig.savefig(buf, format='png')
	plt.close(fig)
	buf.seek(0)
	img_b64 = base64.b64encode(buf.read()).decode('ascii')
	return JSONResponse({'corr': corr.tolist(), 'image_base64': img_b64})


async def query(request: Request) -> Response:
	if request.method == 'GET':
		q = request.query_params.get('q') or request.query_params.get('query') or ''
		try:
			top_k = int(request.query_params.get('top_k') or 5)
		except Exception:
			top_k = 5
	else:
		try:
			payload = await request.json()
		except Exception:
			return JSONResponse({'error': 'invalid json'}, status_code=400)
		q = payload.get('query') or ''
		try:
			top_k = int(payload.get('top_k') or 5)
		except Exception:
			top_k = 5
	if not q:
		return JSONResponse({'error': 'query required'}, status_code=400)
	hits = simple_retrieval(q, top_k=top_k)
	ctx = 'Dataset hits:\n'
	for h in hits:
		ctx += f"- {h.get('title')} ({h.get('link')})\n"
	prompt = f"{SYSTEM_PROMPT}\n{ctx}\nQUESTION:\n{q}\nAnswer concisely and cite dataset hits when relevant."
	try:
		answer = call_gemini(prompt, max_output_tokens=512)
	except Exception as e:
		return JSONResponse({'error': str(e)}, status_code=500)
	return JSONResponse({'answer': answer, 'hits': hits})


async def llm_handler(request: Request) -> Response:
	if request.method == 'GET':
		q = request.query_params.get('q') or request.query_params.get('query') or ''
		try:
			top_k = int(request.query_params.get('top_k') or 5)
		except Exception:
			top_k = 5
	else:
		q = ''
		top_k = 5
		try:
			payload = await request.json()
			q = payload.get('query') or payload.get('q') or ''
			try:
				top_k = int(payload.get('top_k') or top_k)
			except Exception:
				pass
		except Exception:
			try:
				form = await request.form()
				q = form.get('query') or form.get('q') or ''
				try:
					top_k = int(form.get('top_k') or top_k)
				except Exception:
					pass
			except Exception:
				q = ''
	if not q:
		return JSONResponse({'error': 'query required'}, status_code=400)
	hits = simple_retrieval(q, top_k=top_k)
	ctx = 'Dataset hits:\n'
	for h in hits:
		ctx += f"- {h.get('title')} ({h.get('link')})\n"
	prompt = f"{SYSTEM_PROMPT}\n{ctx}\nQUESTION:\n{q}\nAnswer concisely and cite dataset hits when relevant."
	try:
		answer = call_gemini(prompt, max_output_tokens=512)
	except Exception as e:
		return JSONResponse({'error': 'LLM error: ' + str(e), 'hits': hits}, status_code=500)
	return JSONResponse({'answer': answer or '', 'hits': hits})


routes = [
	Route('/pdf/question', pdf_question, methods=['POST']),
	Route('/pdf/summarize', pdf_summarize, methods=['POST']),
	Route('/smiles/view', smiles_view, methods=['GET']),
	Route('/query', query, methods=['GET', 'POST', 'OPTIONS']),
	Route('/llm', llm_handler, methods=['GET', 'POST', 'OPTIONS', 'HEAD', 'PUT', 'PATCH', 'DELETE']),
	Route('/dataset/search', dataset_search, methods=['GET']),
	Route('/graph/correlation', graph_correlation, methods=['POST']),
]

app = Starlette(debug=True, routes=routes)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])


if __name__ == '__main__':
	import uvicorn
	uvicorn.run('backend.main:app', host='127.0.0.1', port=8000, reload=True)

