INSERT INTO "category"
("name", "value", "source")
VALUES
('animals-and-plants', 'Animals & Plants', 'animals-and-plants'),
('waters-and-oceans', 'Waters & Oceans', 'waters-and-oceans'),
('sustainable-agriculture-and-nutrition', 'Sustainable Agriculture and Nutrition', 'sustainable-agriculture-and-nutrition'),
('waste-and-recycling', 'Waste & Recycling', 'waste-and-recycling'),
('industry-transformation', 'Industry Transformation', 'industry-transformation'),
('culture-and-art', 'Culture & Art', 'culture-and-art'),
('protection-of-basic-needs', 'Protection of Basic Needs', 'protection-of-basic-needs'),
('education-and-research', 'Education & Research', 'education-and-research');

INSERT INTO "impact_location"
("name", "value")
VALUES
('asia', 'Asia'),
('mest-nafr-greara', 'Middle East, North Africa and Greater Arabia'),
('europe', 'Europe'),
('north-america', 'North America'),
('central-america-and-the-caribbean', 'Central America and the Caribbean'),
('south-america', 'South America'),
('sub-saharan-africa', 'Sub-Saharan Africa'),
('australia-and-oceania', 'Australia and Oceania');

INSERT INTO "organisation"
("title", "descriptionHeadline", "description", "mediaLink", "totalDonors", "raisedInTotal")
VALUES
('FutureWorks', 'Building the future of our planet', 'We are caring and giving', 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 22, 1220);

INSERT INTO  "project_status"
("symbol", "name", "description") 
VALUES
('rjt', 'rejected', 'A rejected project'),
('pen', 'pending', 'A pending project'),
('clr', 'clearance', 'A project waiting for final clearance'),
('ver', 'verified', 'A verified project'),
('act', 'active', 'An active project');

INSERT INTO "project"
("title", "slug", "description", "organisationId", "image", "balance", "verified", "giveBacks", "totalDonations", "totalDonors", "statusId")
VALUES
('Enabling schooling for children in Mkumbe', 'enabling-schooling-for-children-in-mkumbe', 'We want to enable the children in Mkumbe access to a proper education', 1, 'https://images.unsplash.com/photo-1610500795224-fb86b02926d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 1222, TRUE, TRUE, 10, 22, 5)
('Building a well for residents of Tata', 'building-a-well-for-residents-of-tata', 'The people of tata have no', 1, 'https://images.unsplash.com/photo-1607113208903-6855b60ad046?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXIlMjB3ZWxsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60', 1555, TRUE, TRUE, 4, 2, 5);

INSERT INTO "project_categories_category"
("projectId", "categoryId")
VALUES 
(1, 1), (1, 2), (1, 5);

INSERT INTO "project_impact_locations_impact_location"
("projectId", "impactLocationId")
VALUES
(1, 7);