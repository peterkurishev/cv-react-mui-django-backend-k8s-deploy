FROM python:{{ cookiecutter.python_version }}-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser --disabled-password --no-create-home appuser
USER appuser

EXPOSE 8000
{%- if cookiecutter.use_gunicorn == 'y' %}
CMD ["gunicorn", "{{ cookiecutter.django_project_name }}.wsgi", "--bind", "0.0.0.0:8000", "--workers", "{{ cookiecutter.gunicorn_workers }}", "--timeout", "{{ cookiecutter.gunicorn_timeout }}"]
{%- else %}
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
{%- endif %}
