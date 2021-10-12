INSERT INTO
    "impact_location" ("name", "value")
VALUES
    ('asia', 'Asia'),
    (
        'mest-nafr-greara',
        'Middle East, North Africa and Greater Arabia'
    ),
    ('europe', 'Europe'),
    ('north-america', 'North America'),
    (
        'central-america-and-the-caribbean',
        'Central America and the Caribbean'
    ),
    ('south-america', 'South America'),
    ('sub-saharan-africa', 'Sub-Saharan Africa'),
    ('australia-and-oceania', 'Australia and Oceania');

INSERT INTO
    "organisation" (
        "title",
        "descriptionHeadline",
        "description",
        "mediaLink",
        "totalDonors",
        "raisedInTotal"
    )
VALUES
    (
        'FutureWorks',
        'Building the future of our planet',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1569437061241-a848be43cc82?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        22,
        1220
    );

INSERT INTO
    "project" (
        "title",
        "slug",
        "description",
        "organisationId",
        "image",
        "balance",
        "verified",
        "giveBacks",
        "totalDonations",
        "totalDonors",
        "status",
        "categories"
    )
VALUES
    (
        'Enabling schooling for children in Mkumbe',
        'enabling-schooling-for-children-in-mkumbe',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
        1,
        'https://images.unsplash.com/photo-1610500795224-fb86b02926d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        1222,
        TRUE,
        TRUE,
        10,
        22,
        'ONGOING',
        '{ "educationAndResearch", "protectionOfBasicNeeds" }'
    ),
    (
        'Building a well for residents of Tata',
        'building-a-well-for-residents-of-tata',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. o',
        1,
        'https://images.unsplash.com/photo-1607113208903-6855b60ad046?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXIlMjB3ZWxsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
        1555,
        TRUE,
        TRUE,
        4,
        2,
        'ONGOING',
        '{ "industryTransformation" }'
    ),
    (
        'Funding homes for the victims of Fukushima',
        'funding-homes-for-the-victims-of-fukushima',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ',
        1,
        'https://images.unsplash.com/photo-1610898389529-46c795ab694b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1940&q=80',
        200000,
        TRUE,
        TRUE,
        10,
        5,
        'ONGOING',
        '{ "watersAndOceans", "industryTransformation", "energyAndMobility" }'
    );

INSERT INTO
    "project_impact_locations_impact_location" ("projectId", "impactLocationId")
VALUES
    (1, 7),
    (2, 7),
    (3, 1);

INSERT INTO
    "milestone" (
        "projectId",
        "threshold",
        "status",
        "title",
        "description",
        "mediaLink",
        "balance"
    )
VALUES
    (
        1,
        500,
        2,
        'Buying books',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        500
    ),
    (
        1,
        1000,
        2,
        'Paving the road to the school',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1566625147574-b1cf1ff6cf7d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        1000
    ),
    (
        1,
        400,
        1,
        'Paying the government fee for a new school',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80',
        200
    ),
    (
        1,
        1000,
        0,
        'Buying equipment',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1504863872862-a26e5582ba80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNjaG9vbCUyMGVxdWlwbWVudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
        0
    ),
    (
        1,
        10300,
        0,
        'Build a simple school',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2378&q=80',
        0
    ),
    (
        1,
        1000,
        0,
        'Pay a teacher for 2 months',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1566625147574-b1cf1ff6cf7d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        0
    ),
    (
        2,
        500,
        2,
        'Finding water',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2386&q=80',
        500
    ),
    (
        2,
        400,
        1,
        'Digging to the ground',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1497400338895-940f2d01a6f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80',
        200
    ),
    (
        2,
        1000,
        0,
        'Excavating water',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1541655183253-8d490aa9505e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=921&q=80',
        0
    ),
    (
        3,
        20000,
        2,
        'Rebuild Sakura High School',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1567480849447-0ec63ac72a22?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sJTIwamFwYW58ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
        20000
    ),
    (
        3,
        1000,
        2,
        'Remove radiation from the beach',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1575970141569-5206ad7a81b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
        1000
    ),
    (
        3,
        400,
        1,
        'Resettling the villagers',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        'https://images.unsplash.com/photo-1542931287-023b922fa89b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        200
    );

INSERT INTO
    "user" (
        "email",
        "firstName",
        "lastName",
        "name",
        "walletAddress",
        "password",
        "loginType",
        "confirmed",
        "globalRole"
    )
VALUES
    (
        'test@testmail.com',
        'John',
        'Doe',
        'John Doe',
        '0xAAAAAAAAAAAAAABBAAAAAAAAAAAAAAAAAAAAAAAA',
        '$2a$12$5bYAU4SMWQDpKr1gF2SkZOqKp0Ts1PxNuLExP5e2SoWxFt.Zw9WX6',
        'password',
        TRUE,
        'admin'
    ),
    (
        'other@email.com',
        'Joe',
        'Joestar',
        'JoJo',
        '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        '$2a$12$5bYAU4SMWQDpKr1gF2SkZOqKp0Ts1PxNuLExP5e2SoWxFt.Zw9WX6',
        'password',
        TRUE,
        'user'
    );

INSERT INTO
    "application" (
        "legalName",
        "missionStatement",
        "plannedProjects",
        "accountUsagePlan",
        "organisationType",
        "mainInterestReason",
        "fundingType",
        "acceptFundingFromCorporateSocialResponsibilityPartner",
        "plannedFunding",
        "primaryImpactLocation",
        "userId",
        "applicationState",
        "applicationStep"
    )
VALUES
    (
        'Draft',
        'We want to have impact',
        'Some projects are definetely planned, yes',
        'We want to use everything',
        'registeredNonProfit',
        'fundraising',
        'ongoing',
        FALSE,
        'l',
        'South Africa',
        2,
        'DRAFT',
        'STEP_1'
    ),
    (
        'Rejected',
        'We want to have impact',
        'Some projects are definetely planned, yes',
        'We want to use everything',
        'registeredNonProfit',
        'fundraising',
        'ongoing',
        FALSE,
        'l',
        'South Africa',
        2,
        'ACCEPTED',
        'STEP_1'
    ),
    (
        'Accepted',
        'We want to have impact',
        'Some projects are definetely planned, yes',
        'We want to use everything',
        'registeredNonProfit',
        'fundraising',
        'ongoing',
        FALSE,
        'l',
        'South Africa',
        2,
        'REJECTED',
        'STEP_1'
    );