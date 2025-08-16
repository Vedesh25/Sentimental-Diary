from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
from db import client, db, pages_collection
import joblib
import string
import contractions
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords  # Add this import

# Initialize stop words and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and tokenizer
try:
    loaded_model = joblib.load('./models/logistic_regression_model.pkl')
    loaded_tfidf = joblib.load('./models/tfidf_vectorizer copy.pkl')
    loaded_em_model = joblib.load('./models/best_emotion_model.pkl')
    loaded_vectorizer = joblib.load('./models/tfidf_vectorizer_emotion.pkl')
except FileNotFoundError as e:
    print(f"Error loading model or tokenizer: {e}")
    loaded_model = None
    loaded_tfidf = None

def preprocess_text(text):
    text = text.lower()
    text = contractions.fix(text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = ''.join([i for i in text if not i.isdigit()])
    text = ' '.join([word for word in text.split() if word not in stop_words])
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])
    text = ' '.join(text.split())
    return text

def analyze_text(text):
    """Helper function to analyze both sentiment and emotion"""
    text_preprocessed = preprocess_text(text)
    
    # Sentiment Analysis
    text_tfidf = loaded_tfidf.transform([text_preprocessed])
    sentiment_class = loaded_model.predict(text_tfidf)[0]
    sentiment_prob = loaded_model.predict_proba(text_tfidf)[0]
    sentiment = "Negative" if int(sentiment_class) == 1 else "Positive"
    
    # Emotion Analysis
    text_vectorized = loaded_vectorizer.transform([text_preprocessed])
    emotions = {0: 'sadness', 1: 'joy', 2: 'love', 3: 'anger', 4: 'fear', 5: 'surprise'}
    emotion_class = loaded_em_model.predict(text_vectorized)[0]
    emotion_prob = loaded_em_model.predict_proba(text_vectorized)[0]
    emotion = emotions[emotion_class]
    
    return {
        'sentiment': sentiment,
        'sentiment_probability': sentiment_prob.tolist(),
        'emotion': emotion,
        'emotion_probability': emotion_prob.tolist()
    }

# Error handler for database connection
@app.errorhandler(500)
def handle_db_error(e):
    return jsonify({"error": "Database error occurred"}), 500

@app.route('/pages', methods=['GET'])
def get_pages():
    try:
        selected_date = request.args.get('date')
        if not selected_date:
            return jsonify({"error": "Date parameter is required"}), 400
            
        pages = list(pages_collection.find({'date': selected_date}))
        return jsonify([{**page, '_id': str(page['_id'])} for page in pages])
    except Exception as e:
        print(f"Error in get_pages: {e}")
        return jsonify({"error": "Failed to fetch pages"}), 500

@app.route('/pages', methods=['POST'])
def add_page():
    try:
        page = request.json
        if not page or 'date' not in page or 'title' not in page:
            return jsonify({"error": "Invalid page data"}), 400
        
        # Analyze text if models are loaded
        if all([loaded_model, loaded_tfidf, loaded_em_model, loaded_vectorizer]):
            analysis = analyze_text(page['content'])
            page.update(analysis)
        
        result = pages_collection.insert_one(page)
        return jsonify({**page, '_id': str(result.inserted_id)})
    except Exception as e:
        print(f"Error in add_page: {e}")
        return jsonify({"error": "Failed to add page"}), 500

@app.route('/pages/<page_id>', methods=['PUT'])
def update_page(page_id):
    try:
        content = request.json.get('content')
        if content is None:
            return jsonify({"error": "Content is required"}), 400
        
        # Analyze text if models are loaded
        if all([loaded_model, loaded_tfidf, loaded_em_model, loaded_vectorizer]):
            analysis = analyze_text(content)
            update_data = {'content': content, **analysis}
        else:
            update_data = {'content': content}
        
        result = pages_collection.update_one(
            {'_id': ObjectId(page_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Page not found"}), 404
            
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error in update_page: {e}")
        return jsonify({"error": "Failed to update page"}), 500

@app.route('/pages/<page_id>', methods=['DELETE'])
def delete_page(page_id):
    try:
        result = pages_collection.delete_one({'_id': ObjectId(page_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Page not found"}), 404
            
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error in delete_page: {e}")
        return jsonify({"error": "Failed to delete page"}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
            
        if not all([loaded_model, loaded_tfidf, loaded_em_model, loaded_vectorizer]):
            return jsonify({"error": "Models not loaded properly"}), 500
            
        analysis = analyze_text(text)
        return jsonify(analysis)
    except Exception as e:
        print(f"Error in analyze: {e}")
        return jsonify({"error": "Analysis failed"}), 500

if __name__ == '__main__':
    if client is None or db is None:
        print("Warning: MongoDB connection failed. Application may not work correctly.")
    app.run(debug=True)