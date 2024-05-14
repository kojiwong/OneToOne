#!/bin/bash

# Update package index and install necessary packages
sudo apt update
sudo apt -y install python3.9 python3.9-venv

# Check if Python is installed successfully
if ! command -v python3.9 &> /dev/null; then
    echo "Error: Python3.9 installation failed."
    exit 1
fi

# Create a virtual environment in the current directory
python3.9 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Verify if the virtual environment is activated
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "Virtual environment activated successfully."
else
    echo "Error: Virtual environment activation failed."
    exit 1
fi

# Install any additional Python packages as needed within the virtual environment
# Example: pip install package_name
python3.9 -m pip install -r requirements.txt

python3.9 manage.py makemigrations
python3.9 manage.py migrate

# Deactivate the virtual environment
# deactivate

echo "Python and virtual environment setup completed."
