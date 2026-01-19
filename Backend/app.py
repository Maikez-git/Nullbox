import sys
import os

# Ensure backend folder is in Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from routes.analyze import analyze_bp


def create_app():
    app = Flask(__name__)

    # Enable CORS for frontend-backend communication
    from flask_cors import CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(analyze_bp)

    @app.route("/")
    def health_check():
        return {"status": "Backend running"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
