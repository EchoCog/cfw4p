-- ElizaOS-OpenCog-GnuCash Workers for Platforms Database Schema

-- Customers table for managing platform users
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'basic',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customer tokens for API authentication
CREATE TABLE IF NOT EXISTS customer_tokens (
    customer_id TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Dispatch limits for worker resource management
CREATE TABLE IF NOT EXISTS dispatch_limits (
    script_id TEXT PRIMARY KEY,
    cpuMs INTEGER,
    memory INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Outbound workers configuration
CREATE TABLE IF NOT EXISTS outbound_workers (
    script_id TEXT PRIMARY KEY,
    outbound_script_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Financial accounts (for elizoscog integration)
CREATE TABLE IF NOT EXISTS financial_accounts (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance REAL DEFAULT 0.0,
    currency TEXT DEFAULT 'USD',
    parent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (parent_id) REFERENCES financial_accounts(id)
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    account_from TEXT,
    account_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (account_from) REFERENCES financial_accounts(id),
    FOREIGN KEY (account_to) REFERENCES financial_accounts(id)
);

-- Financial insights and AI responses cache
CREATE TABLE IF NOT EXISTS financial_insights (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    confidence REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Insert sample data for testing
INSERT OR IGNORE INTO customers (id, name, plan_type) VALUES 
    ('demo-customer-1', 'Demo Customer', 'premium'),
    ('demo-customer-2', 'Test User', 'basic');

INSERT OR IGNORE INTO customer_tokens (customer_id, token) VALUES 
    ('demo-customer-1', 'demo-token-123'),
    ('demo-customer-2', 'test-token-456');

INSERT OR IGNORE INTO financial_accounts (id, customer_id, name, type, balance, parent_id) VALUES 
    ('acc-1', 'demo-customer-1', 'Assets', 'ASSET', 50000.00, NULL),
    ('acc-2', 'demo-customer-1', 'Checking Account', 'BANK', 5000.00, 'acc-1'),
    ('acc-3', 'demo-customer-1', 'Savings Account', 'BANK', 45000.00, 'acc-1'),
    ('acc-4', 'demo-customer-1', 'Expenses', 'EXPENSE', 2500.00, NULL),
    ('acc-5', 'demo-customer-1', 'Groceries', 'EXPENSE', 800.00, 'acc-4'),
    ('acc-6', 'demo-customer-1', 'Dining Out', 'EXPENSE', 450.00, 'acc-4');

INSERT OR IGNORE INTO financial_transactions (id, customer_id, date, description, amount, account_from, account_to) VALUES 
    ('tx-1', 'demo-customer-1', '2024-07-18', 'Grocery Store Purchase', -85.50, 'acc-2', 'acc-5'),
    ('tx-2', 'demo-customer-1', '2024-07-17', 'Restaurant Dinner', -65.00, 'acc-2', 'acc-6'),
    ('tx-3', 'demo-customer-1', '2024-07-16', 'Salary Deposit', 3500.00, NULL, 'acc-2'),
    ('tx-4', 'demo-customer-1', '2024-07-15', 'Coffee Shop', -12.50, 'acc-2', 'acc-6'),
    ('tx-5', 'demo-customer-1', '2024-07-14', 'Supermarket', -125.75, 'acc-2', 'acc-5');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_tokens_customer_id ON customer_tokens(customer_id);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_customer_id ON financial_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_customer_id ON financial_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date);
CREATE INDEX IF NOT EXISTS idx_financial_insights_customer_id ON financial_insights(customer_id);
CREATE INDEX IF NOT EXISTS idx_financial_insights_expires_at ON financial_insights(expires_at);

