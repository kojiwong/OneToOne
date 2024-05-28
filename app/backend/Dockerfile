# Use the latest python3 alpine image as the base
FROM python:3-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file over to our working directory and install requirements
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the files over to /app
COPY . /app

# Make Django migrations
RUN python manage.py makemigrations

# Runs on port 8000
EXPOSE 8000

# Default command, access server by localhost:8000
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]