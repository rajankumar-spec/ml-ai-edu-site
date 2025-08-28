# ML & AI Education Site

This project is an educational platform designed to teach Machine Learning and Artificial Intelligence concepts through interactive visualizations.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd ml-ai-edu-site
    ```

2.  **Create a virtual environment (optional but recommended):**
    ```bash
    python -m venv .venv
    ```

3.  **Activate the virtual environment:**
    *   **On Windows:**
        ```bash
        .venv\Scripts\activate
        ```
    *   **On macOS/Linux:**
        ```bash
        source .venv/bin/activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## How to Run the Application

1.  **Ensure your virtual environment is activated.**
2.  **Run the Flask application:**
    ```bash
    python backend/main.py
    ```
3.  **Open your web browser** and navigate to `http://127.0.0.1:5000` (or the address shown in your terminal).

## Project Structure

*   `backend/`: Contains the Flask application logic, including routes and utility functions.
*   `data/`: Stores static data like `topics.json`.
*   `static/`: Houses static assets like CSS and JavaScript files.
*   `templates/`: Contains Jinja2 templates for rendering HTML pages.
*   `visualizations/`: Scripts for generating sample data and visualizations.
*   `requirements.txt`: Lists all Python dependencies.
*   `README.md`: This file, providing an overview and instructions.
