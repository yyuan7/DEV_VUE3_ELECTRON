-- Pickup Processing Fee --------------------------------- Double check with Jim if all glasses share the same pickup fee
-- State-based Pickup Fee
CREATE TABLE state_pickup_fee (
    state_code CHAR(2) PRIMARY KEY, -- State abbreviation
    glass_fee DECIMAL(10, 2),
    plastic_fee DECIMAL(10, 2),
    metal_fee DECIMAL(10, 2)
);

-- Company-based Pickup Fee
CREATE TABLE company_pickup_fee (
    company_id INT PRIMARY KEY, -- Foreign key to companies table
    glass_fee DECIMAL(10, 2),
    plastic_fee DECIMAL(10, 2),
    metal_fee DECIMAL(10, 2),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Fetch Operation
SELECT 
    COALESCE(cf.glass_fee, sf.glass_fee) AS glass_fee,
    COALESCE(cf.plastic_fee, sf.plastic_fee) AS plastic_fee,
    COALESCE(cf.metal_fee, sf.metal_fee) AS metal_fee
FROM 
    companies c
JOIN 
    state_fees sf ON c.state_code = sf.state_code
LEFT JOIN 
    company_fees cf ON c.company_id = cf.company_id
WHERE 
    c.company_id = 1; -- TODO: replace with the company
