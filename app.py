import os
from starlette.applications import Starlette
from starlette.responses import FileResponse, PlainTextResponse
from starlette.routing import Route
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist')

async def spa(request: Request):
    path = request.path_params.get('path') or ''
    if path == '' or path.endswith('/'):
        index = os.path.join(DIST_DIR, 'index.html')
        if os.path.exists(index):
            return FileResponse(index, media_type='text/html')
        return PlainTextResponse('index.html not found', status_code=404)
    full = os.path.join(DIST_DIR, path.lstrip('/'))
    if os.path.exists(full) and os.path.isfile(full):
        return FileResponse(full)
    index = os.path.join(DIST_DIR, 'index.html')
    if os.path.exists(index):
        return FileResponse(index, media_type='text/html')
    return PlainTextResponse('Not found', status_code=404)

routes = [Route('/', spa), Route('/{path:path}', spa)]

app = Starlette(routes=routes)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='127.0.0.1', port=8080, reload=True)
