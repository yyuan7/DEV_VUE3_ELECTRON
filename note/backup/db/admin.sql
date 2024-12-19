-- Admin
-- Admin General
-- Company Home - EXCEPT MANUFACTURER
-- Checkbox: `company` with NO active billing rules ONLY
-- Performance Issue: it involves scanning all rows of the `billing` table
SELECT c.CompanyId, c.Name, c.primaryContact, c.secondaryContact, c.lastUpdatedDate
FROM Company c
WHERE NOT EXISTS (
    SELECT 1
    FROM Billing b
    WHERE b.CompanyId = c.CompanyId
);
-- OR
SELECT c.CompanyId, c.Name, c.primaryContact, c.secondaryContact, c.lastUpdatedDate
FROM Company c
LEFT JOIN Billing b
ON c.CompanyId = b.CompanyId
WHERE b.CompanyId IS NULL;

-- Company Home - EXCEPT MANUFACTURER
-- Checkbox: `company` with NO active billing rules ONLY

-- Admin Fee