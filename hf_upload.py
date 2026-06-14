import os, sys
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from huggingface_hub import HfApi

api = HfApi()
repo_id = 'o-meiuqer-o/tinygames'
repo_type = 'space'
base = 'd:/tinygames/public'

# Upload all files in public directory
api.upload_folder(
    folder_path=base,
    path_in_repo='public',
    repo_id=repo_id,
    repo_type=repo_type,
)

print('All files in public/ uploaded successfully!')
