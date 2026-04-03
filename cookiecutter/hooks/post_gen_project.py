#!/usr/bin/env python
"""Post-generation hooks for cookiecutter."""
import os
import shutil


def remove_file(filepath):
    if os.path.isfile(filepath):
        os.remove(filepath)


def remove_dir(dirpath):
    if os.path.isdir(dirpath):
        shutil.rmtree(dirpath)


# Remove optional components based on user choices

if '{{ cookiecutter.use_kubernetes }}' != 'y':
    remove_dir('helm')

if '{{ cookiecutter.use_nginx_proxy }}' != 'y':
    remove_dir('nginx')

if '{{ cookiecutter.use_github_actions }}' != 'y':
    remove_dir('.github')

if '{{ cookiecutter.use_jenkins }}' != 'y':
    remove_file('Jenkinsfile')

if '{{ cookiecutter.license }}' == 'none':
    remove_file('LICENSE')

print("")
print("=" * 60)
print("Project '{{ cookiecutter.project_name }}' created successfully!")
print("=" * 60)
print("")
print("Next steps:")
print("  cd {{ cookiecutter.project_slug }}")
print("  docker compose up")
print("")
if '{{ cookiecutter.use_kubernetes }}' == 'y':
    print("For Kubernetes deployment:")
    print("  helm upgrade --install {{ cookiecutter.helm_chart_name }} ./helm \\")
    print("    --set domain={{ cookiecutter.domain }}")
    print("")
