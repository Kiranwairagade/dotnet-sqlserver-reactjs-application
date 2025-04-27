from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ChatInput Model (for chatbot training data)
class ChatInput(db.Model):
    __tablename__ = 'chat_input'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)
    response = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<ChatInput {self.message}>'

# ChatPrediction Model (for chatbot prediction results)
class ChatPrediction(db.Model):
    __tablename__ = 'chat_prediction'

    id = db.Column(db.Integer, primary_key=True)
    predicted_response = db.Column(db.String(255), nullable=False)
    scores = db.Column(db.PickleType, nullable=False)  # Storing scores as a pickled object

    def __repr__(self):
        return f'<ChatPrediction {self.predicted_response}>'

# FAQ Model
class FAQ(db.Model):
    __tablename__ = 'faq'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<FAQ {self.question}>'

# Brand Model
class Brand(db.Model):
    __tablename__ = 'brands'

    brand_id = db.Column(db.Integer, primary_key=True)
    brand_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Brand {self.brand_name}>'

# Category Model
class Category(db.Model):
    __tablename__ = 'product_categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    products = db.relationship('Product', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.category_name}>'

# Product Model
class Product(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_categories.category_id'), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Product {self.name}>'

# Supplier Model
class Supplier(db.Model):
    __tablename__ = 'suppliers'

    supplier_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Supplier {self.name}>'

# User Model
class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    permissions = db.Column(db.String(255), nullable=True)  # Storing permissions as a comma-separated string

    user_permissions = db.relationship('UserPermission', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

# UserPermission Model (permissions for each user)
class UserPermission(db.Model):
    __tablename__ = 'user_permissions'

    user_permission_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    module_name = db.Column(db.String(100), nullable=False)
    can_create = db.Column(db.Boolean, default=False)
    can_read = db.Column(db.Boolean, default=False)
    can_update = db.Column(db.Boolean, default=False)
    can_delete = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<UserPermission {self.module_name}>'

