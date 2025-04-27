from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import spacy
import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# Initialize FastAPI app
app = FastAPI()

# CORS setup for frontend
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup for SQL Server
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL', "mssql+pyodbc://sa:kiran@HP\\SQLEXPRESS/ECommerceDB?driver=ODBC+Driver+17+for+SQL+Server")
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"driver": "ODBC Driver 17 for SQL Server"})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class MessageDB(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    is_user = Column(Integer, nullable=False)  # 1 for user, 0 for bot
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SuggestionDB(Base):
    __tablename__ = "suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(255), nullable=False, unique=True)
    usage_count = Column(Integer, default=0)

# Models from your database schema - Updated to match database column names
class Brand(Base):
    __tablename__ = "brands"
    
    BrandId = Column(Integer, primary_key=True)
    BrandName = Column(String(255), nullable=False)
    Description = Column(String(500))
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)
    UpdatedAt = Column(DateTime)

class Category(Base):
    __tablename__ = "product_categories"
    
    CategoryId = Column(Integer, primary_key=True)
    CategoryName = Column(String(100), nullable=False)
    Description = Column(String(255))
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)
    UpdatedAt = Column(DateTime)

class Product(Base):
    __tablename__ = "products"
    
    ProductId = Column(Integer, primary_key=True)
    Name = Column(String(100), nullable=False)
    Price = Column(String, nullable=False)  # Using String for precision handling
    Category = Column(String(100), nullable=False)
    Stock = Column(Integer, nullable=False)
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)
    UpdatedAt = Column(DateTime)
    CategoryId = Column(Integer, nullable=False)

class User(Base):
    __tablename__ = "users"
    
    UserId = Column(Integer, primary_key=True)
    Username = Column(String(100), nullable=False)
    Email = Column(String(100), nullable=False)
    FirstName = Column(String(100), nullable=False)
    LastName = Column(String(100), nullable=False)
    PasswordHash = Column(String(255), nullable=False)
    IsActive = Column(Integer, default=1)  # 1 for active, 0 for inactive
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)
    UpdatedAt = Column(DateTime)
    Permissions = Column(String(255))

class UserPermission(Base):
    __tablename__ = "user_permissions"
    
    UserPermissionId = Column(Integer, primary_key=True)
    UserId = Column(Integer, nullable=False)
    ModuleName = Column(String(100), nullable=False)
    CanCreate = Column(Integer, default=0)  # Using Integer for boolean
    CanRead = Column(Integer, default=0)
    CanUpdate = Column(Integer, default=0)
    CanDelete = Column(Integer, default=0)

class Supplier(Base):
    __tablename__ = "suppliers"
    
    SupplierId = Column(Integer, primary_key=True)
    Name = Column(String(255), nullable=False)
    Email = Column(String(255))
    Phone = Column(String(50))
    Address = Column(String(500))
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)
    UpdatedAt = Column(DateTime)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Add default suggestions
def initialize_suggestions():
    db = SessionLocal()
    default_suggestions = [
        "List all products",
        "Show product categories",
        "Show brands",
        "List all users",
        "How many products in stock?",
        "How many suppliers?",
        "Show out of stock products",
        "Show user permissions"
    ]
    
    for suggestion in default_suggestions:
        existing = db.query(SuggestionDB).filter(SuggestionDB.content == suggestion).first()
        if not existing:
            db.add(SuggestionDB(content=suggestion))
    
    db.commit()
    db.close()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback if model not found
    print("Warning: spaCy model not found. Using small model.")
    nlp = spacy.blank("en")

# Models
class MessageRequest(BaseModel):
    message: str

class Entity(BaseModel):
    label: str
    text: str

class ChatbotResponse(BaseModel):
    message: str
    entities: List[Entity] = []
    message_id: int

class SuggestionsResponse(BaseModel):
    suggestions: List[str]

class Message(BaseModel):
    id: int
    content: str
    is_user: bool
    timestamp: datetime.datetime

class MessageHistoryResponse(BaseModel):
    messages: List[Message]

# Database query functions - Updated to match new column names
def get_products(db: Session, limit: int = 10):
    return db.query(Product).limit(limit).all()

def get_categories(db: Session):
    return db.query(Category).all()

def get_brands(db: Session):
    return db.query(Brand).all()

def get_users(db: Session, limit: int = 10):
    return db.query(User).limit(limit).all()

def get_suppliers(db: Session):
    return db.query(Supplier).all()

def get_products_count(db: Session):
    return db.query(func.count(Product.ProductId)).scalar()

def get_products_in_stock_count(db: Session):
    return db.query(func.count(Product.ProductId)).filter(Product.Stock > 0).scalar()

def get_out_of_stock_products(db: Session):
    return db.query(Product).filter(Product.Stock == 0).all()

def get_product_by_category(db: Session, category_id: int):
    return db.query(Product).filter(Product.CategoryId == category_id).all()

def get_user_permissions(db: Session, user_id: int = None):
    if user_id:
        return db.query(UserPermission).filter(UserPermission.UserId == user_id).all()
    return db.query(UserPermission).all()

def get_product_by_name(db: Session, name: str):
    return db.query(Product).filter(Product.Name.like(f"%{name}%")).all()

# Enhanced response generation function - Updated to match new column names
def generate_response(message: str, db: Session):
    message_lower = message.lower()
    
    # Product queries
    if "list" in message_lower and "product" in message_lower:
        products = get_products(db)
        if products:
            product_list = "\n".join([f"- {product.Name}: ${product.Price}, Stock: {product.Stock}" for product in products])
            return f"Here are the products in our database:\n{product_list}"
        return "No products found in the database."
    
    elif "product" in message_lower and "category" in message_lower:
        categories = get_categories(db)
        if categories:
            category_list = "\n".join([f"- {category.CategoryName}: {category.Description}" for category in categories])
            return f"Here are the product categories:\n{category_list}"
        return "No product categories found in the database."
    
    elif "out of stock" in message_lower:
        out_of_stock = get_out_of_stock_products(db)
        if out_of_stock:
            product_list = "\n".join([f"- {product.Name}" for product in out_of_stock])
            return f"Out of stock products:\n{product_list}"
        return "All products are currently in stock."
    
    elif "how many product" in message_lower or "product count" in message_lower:
        count = get_products_count(db)
        in_stock = get_products_in_stock_count(db)
        return f"There are {count} products in total, with {in_stock} currently in stock."
    
    # Brand queries
    elif "brand" in message_lower:
        brands = get_brands(db)
        if brands:
            brand_list = "\n".join([f"- {brand.BrandName}: {brand.Description}" for brand in brands])
            return f"Here are the brands in our database:\n{brand_list}"
        return "No brands found in the database."
    
    # User queries
    elif "list" in message_lower and "user" in message_lower:
        users = get_users(db)
        if users:
            user_list = "\n".join([f"- {user.Username} ({user.FirstName} {user.LastName}, {user.Email})" for user in users])
            return f"Here are the users in our system:\n{user_list}"
        return "No users found in the database."
    
    elif "user permission" in message_lower:
        permissions = get_user_permissions(db)
        if permissions:
            perm_list = "\n".join([
                f"- User {perm.UserId}, Module: {perm.ModuleName}, "
                f"Create: {'Yes' if perm.CanCreate else 'No'}, "
                f"Read: {'Yes' if perm.CanRead else 'No'}, "
                f"Update: {'Yes' if perm.CanUpdate else 'No'}, "
                f"Delete: {'Yes' if perm.CanDelete else 'No'}"
                for perm in permissions
            ])
            return f"User permissions:\n{perm_list}"
        return "No user permissions found in the database."
    
    # Supplier queries
    elif "supplier" in message_lower:
        suppliers = get_suppliers(db)
        if suppliers:
            supplier_list = "\n".join([f"- {supplier.Name} (Email: {supplier.Email}, Phone: {supplier.Phone})" for supplier in suppliers])
            return f"Here are our suppliers:\n{supplier_list}"
        return "No suppliers found in the database."
    
    # Search for a specific product
    elif "find product" in message_lower or "search product" in message_lower:
        # Extract potential product name from message
        doc = nlp(message)
        product_name = None
        for chunk in doc.noun_chunks:
            if "product" not in chunk.text.lower():
                product_name = chunk.text
                break
        
        if product_name:
            products = get_product_by_name(db, product_name)
            if products:
                product_list = "\n".join([f"- {product.Name}: ${product.Price}, Stock: {product.Stock}" for product in products])
                return f"Found these products matching '{product_name}':\n{product_list}"
            return f"No products found matching '{product_name}'."
    
    # Database overview
    elif "database" in message_lower or "schema" in message_lower:
        product_count = get_products_count(db)
        category_count = db.query(func.count(Category.CategoryId)).scalar()
        brand_count = db.query(func.count(Brand.BrandId)).scalar()
        user_count = db.query(func.count(User.UserId)).scalar()
        supplier_count = db.query(func.count(Supplier.SupplierId)).scalar()
        
        return (
            f"Database overview:\n"
            f"- {product_count} products\n"
            f"- {category_count} product categories\n"
            f"- {brand_count} brands\n"
            f"- {user_count} users\n"
            f"- {supplier_count} suppliers"
        )
    
    # Help message
    elif "help" in message_lower:
        return (
            "I can help you with information from our e-commerce database. Try asking:\n"
            "- List all products\n"
            "- Show product categories\n"
            "- Show brands\n"
            "- List all users\n"
            "- Show out of stock products\n"
            "- How many products do we have?\n"
            "- Show user permissions\n"
            "- Show suppliers\n"
            "- Search for a specific product"
        )
    
    # Default response
    return (
        f"I received your message: '{message}'. I can provide information about products, "
        f"categories, brands, users, and suppliers in our database. Type 'help' to see what I can do."
    )

# Endpoints
@app.post("/chatbot", response_model=ChatbotResponse)
async def chatbot(data: MessageRequest, db: Session = Depends(get_db)):
    try:
        user_message = data.message.strip()

        if not user_message:
            raise HTTPException(status_code=400, detail="No message provided")
        
        # Save user message to database
        user_msg_db = MessageDB(content=user_message, is_user=1)
        db.add(user_msg_db)
        db.commit()
        db.refresh(user_msg_db)
        
        # Process the message with spaCy
        doc = nlp(user_message)
        entities = [{"label": ent.label_, "text": ent.text} for ent in doc.ents]
        
        # Generate bot response
        bot_response = generate_response(user_message, db)
        
        # Save bot response to database
        bot_msg_db = MessageDB(content=bot_response, is_user=0)
        db.add(bot_msg_db)
        db.commit()
        db.refresh(bot_msg_db)
        
        # Update suggestion usage if the message matches any suggestion
        suggestion = db.query(SuggestionDB).filter(SuggestionDB.content == user_message).first()
        if suggestion:
            suggestion.usage_count += 1
            db.commit()
        
        return ChatbotResponse(
            message=bot_response,
            entities=entities,
            message_id=bot_msg_db.id
        )
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error: {str(ex)}")

@app.get("/suggestions", response_model=SuggestionsResponse)
async def suggestions(db: Session = Depends(get_db)):
    # Get top suggestions by usage count
    db_suggestions = db.query(SuggestionDB).order_by(SuggestionDB.usage_count.desc()).limit(6).all()
    
    if not db_suggestions:
        # Initialize with defaults if empty
        initialize_suggestions()
        db_suggestions = db.query(SuggestionDB).limit(6).all()
    
    return SuggestionsResponse(
        suggestions=[suggestion.content for suggestion in db_suggestions]
    )

@app.get("/history", response_model=MessageHistoryResponse)
async def message_history(limit: int = 50, db: Session = Depends(get_db)):
    messages = db.query(MessageDB).order_by(MessageDB.timestamp.desc()).limit(limit).all()
    
    return MessageHistoryResponse(
        messages=[Message(
            id=msg.id,
            content=msg.content,
            is_user=bool(msg.is_user),
            timestamp=msg.timestamp
        ) for msg in messages]
    )

@app.post("/add-suggestion")
async def add_suggestion(data: MessageRequest, db: Session = Depends(get_db)):
    new_suggestion = data.message.strip()

    # Check if suggestion already exists
    existing = db.query(SuggestionDB).filter(SuggestionDB.content == new_suggestion).first()
    if existing:
        return {"status": "exists", "message": "Suggestion already exists"}
    
    # Add new suggestion
    db.add(SuggestionDB(content=new_suggestion))
    db.commit()
    
    return {"status": "success", "message": "Suggestion added successfully"}

# Initialize app with default data
@app.on_event("startup")
async def startup_event():
    initialize_suggestions()

# Start the server with the correct port
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)