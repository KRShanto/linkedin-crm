CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "People" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" TEXT,
    "url" TEXT,
    "profileImage" TEXT,
    "location" TEXT,
    "headline" TEXT,
    "about" TEXT,
    "currentPosition" TEXT,
    "currentCompany" TEXT,
    "connectionDegree" INTEGER DEFAULT 0 NOT NULL,
    "websites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT,
    "phone" TEXT,
    "connected" BOOLEAN DEFAULT FALSE NOT NULL,
    "status" TEXT DEFAULT 'Not Started (1/12)' NOT NULL CHECK (
        "status" IN (
            'Not Started (1/12)',
            'Sent Connection (2/12)',
            'Accepted Connection (3/12)',
            'Sent Initial Message (4/12)',
            'Conversation Started (5/12)',
            'Asked Report (6/12)',
            'Sent Report (7/12)',
            'Asked Mockup (8/12)',
            'Sent Mockup (9/12)',
            'Sent Quotation (10/12)',
            'Payment Done (11/12)',
            'Delivery Done (12/12)',
            'Cancelled'
        )
    ),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create a trigger to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_people_updated_at
    BEFORE UPDATE ON "People"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
