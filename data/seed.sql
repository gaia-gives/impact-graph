INSERT INTO "category" ("name", "value", "source")
    VALUES ('animals-and-plants', 'Animals & Plants', 'animals-and-plants'), ('waters-and-oceans', 'Waters & Oceans', 'waters-and-oceans'), ('sustainable-agriculture-and-nutrition', 'Sustainable Agriculture and Nutrition', 'sustainable-agriculture-and-nutrition'), ('waste-and-recycling', 'Waste & Recycling', 'waste-and-recycling'), ('industry-transformation', 'Industry Transformation', 'industry-transformation'), ('culture-and-art', 'Culture & Art', 'culture-and-art'), ('protection-of-basic-needs', 'Protection of Basic Needs', 'protection-of-basic-needs'), ('education-and-research', 'Education & Research', 'education-and-research');

INSERT INTO "impact_location" ("name", "value")
    VALUES ('asia', 'Asia'), ('mest-nafr-greara', 'Middle East, North Africa and Greater Arabia'), ('europe', 'Europe'), ('north-america', 'North America'), ('central-america-and-the-caribbean', 'Central America and the Caribbean'), ('south-america', 'South America'), ('sub-saharan-africa', 'Sub-Saharan Africa'), ('australia-and-oceania', 'Australia and Oceania');

INSERT INTO "organisation" ("title", "descriptionHeadline", "description", "mediaLink", "totalDonors", "raisedInTotal")
    VALUES ('FutureWorks', 'Building the future of our planet', 'We are caring and giving', 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 22, 1220);

INSERT INTO "project_status" ("symbol", "name", "description")
    VALUES ('rjt', 'rejected', 'A rejected project'), ('pen', 'pending', 'A pending project'), ('clr', 'clearance', 'A project waiting for final clearance'), ('ver', 'verified', 'A verified project'), ('act', 'active', 'An active project');

INSERT INTO "project" ("title", "slug", "description", "organisationId", "image", "balance", "verified", "giveBacks", "totalDonations", "totalDonors", "statusId")
    VALUES ('Enabling schooling for children in Mkumbe', 'enabling-schooling-for-children-in-mkumbe', 'We want to enable the children in Mkumbe access to a proper education', 1, 'https://images.unsplash.com/photo-1610500795224-fb86b02926d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 1222, TRUE, TRUE, 10, 22, 5), ('Building a well for residents of Tata', 'building-a-well-for-residents-of-tata', 'The people of tata have no', 1, 'https://images.unsplash.com/photo-1607113208903-6855b60ad046?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXIlMjB3ZWxsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60', 1555, TRUE, TRUE, 4, 2, 5), ('Funding homes for the victims of Fukushima', 'funding-homes-for-the-victims-of-fukushima', 'We want to give the people of Fukushima a new home after the devastating tsunami', 1, 'https://images.unsplash.com/photo-1610898389529-46c795ab694b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1940&q=80', 200000, TRUE, TRUE, 10, 5, 5);

INSERT INTO "project_categories_category" ("projectId", "categoryId")
    VALUES (1, 1), (1, 2), (1, 5), (2, 1), (2, 2), (3, 5), (3, 6);

INSERT INTO "project_impact_locations_impact_location" ("projectId", "impactLocationId")
    VALUES (1, 7), (2, 7), (3, 1);

INSERT INTO "milestone" ("projectId", "threshold", "status", "title", "description", "mediaLink", "balance")
    VALUES (1, 500, 2, 'Buying books', '', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 500), (1, 1000, 2, 'Paving the road to the school', '', 'https://images.unsplash.com/photo-1566625147574-b1cf1ff6cf7d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 1000), (1, 400, 1, 'Paying the government fee for a new school', '', 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80', 200), (1, 1000, 0, 'Buying equipment', '', 'https://images.unsplash.com/photo-1504863872862-a26e5582ba80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNjaG9vbCUyMGVxdWlwbWVudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60', 0), (1, 10300, 0, 'Build a simple school', '', 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2378&q=80', 0), (1, 1000, 0, 'Pay a teacher for 2 months', '', 'https://images.unsplash.com/photo-1566625147574-b1cf1ff6cf7d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 0), (2, 500, 2, 'Finding water', '', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2386&q=80', 500), (2, 400, 1, 'Digging to the ground', '', 'https://images.unsplash.com/photo-1497400338895-940f2d01a6f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80', 200), (2, 1000, 0, 'Excavating water', '', 'https://images.unsplash.com/photo-1541655183253-8d490aa9505e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=921&q=80', 0), (3, 20000, 2, 'Rebuild Sakura High School', '', 'https://images.unsplash.com/photo-1567480849447-0ec63ac72a22?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sJTIwamFwYW58ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60', 20000), (3, 1000, 2, 'Remove radiation from the beach', '', 'https://images.unsplash.com/photo-1575970141569-5206ad7a81b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80', 1000), (3, 400, 1, 'Resettling the villagers', '', 'https://images.unsplash.com/photo-1542931287-023b922fa89b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 200);

UPDATE
    "milestone"
SET
    "description" = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet,';

INSERT INTO "user" ("email", "firstName", "lastName", "name", "walletAddress", "password", "loginType", "confirmed", "globalRole")
    VALUES ('test@testmail.com', 'John', 'Doe', 'John Doe', '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '$2a$12$5bYAU4SMWQDpKr1gF2SkZOqKp0Ts1PxNuLExP5e2SoWxFt.Zw9WX6', 'password', TRUE, 'admin');

INSERT INTO "application" ("legalName", "address", "email", "missionStatement", "plannedProjects", "accountUsagePlan", "website", "organisationType", "mainInterestReason", "fundingType", "acceptFundingFromCorporateSocialResponsibilityPartner", "plannedFunding", "primaryImpactLocation", "userId", "applicationState", "applicationStep")
    VALUES ('Testorga', 'Street1;343432;BigCity;Liberia', 'aiosjfisajf@asdadf.de', 'We want to have impact', 'Some projects are definetely planned, yes', 'We want to use everything', 'Webite.com', 'registeredNonProfit', 'fundraising', 'ongoing', FALSE, 400, 'South Africa', 1, 'DRAFT', 'STEP_1');

    


