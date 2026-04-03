#!/usr/bin/env python
"""Pre-generation hooks for cookiecutter."""
import re
import sys

PROJECT_SLUG = '{{ cookiecutter.project_slug }}'
DJANGO_PROJECT_NAME = '{{ cookiecutter.django_project_name }}'
DJANGO_APP_NAME = '{{ cookiecutter.django_app_name }}'

# Validate project slug
if not re.match(r'^[a-z][a-z0-9-]*$', PROJECT_SLUG):
    print(f"ERROR: '{PROJECT_SLUG}' is not a valid project slug.")
    print("Must start with a letter and contain only lowercase letters, numbers, and hyphens.")
    sys.exit(1)

# Validate Django project name (must be a valid Python identifier)
if not re.match(r'^[a-z][a-z0-9_]*$', DJANGO_PROJECT_NAME):
    print(f"ERROR: '{DJANGO_PROJECT_NAME}' is not a valid Django project name.")
    print("Must be a valid Python identifier (lowercase letters, numbers, underscores).")
    sys.exit(1)

# Validate Django app name
if not re.match(r'^[a-z][a-z0-9_]*$', DJANGO_APP_NAME):
    print(f"ERROR: '{DJANGO_APP_NAME}' is not a valid Django app name.")
    print("Must be a valid Python identifier (lowercase letters, numbers, underscores).")
    sys.exit(1)

# Django project name and app name must differ
if DJANGO_PROJECT_NAME == DJANGO_APP_NAME:
    print(f"ERROR: Django project name and app name cannot be the same ('{DJANGO_PROJECT_NAME}').")
    sys.exit(1)
