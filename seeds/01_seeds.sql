INSERT INTO users (name, email, password)
VALUES ('Jared', 'j@gmai.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Adam', 'adam@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Richard', 'rich@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Speed lamp', 'description', 'link', 'link', 200, 2, 3, 4, 'Canada', 'Bloor', 'Toronto', 'Ontario', 'M4M 2X9', True),
(1, 'ACC', 'Description', 'Link', 'Link', 1000, 1, 1, 2, 'Canada', 'Blue Jays Way', 'Toronto', 'Ontario', 'M4X 1X0', True),
(2, 'Blue Mountain', 'Description', 'Link', 'Link', 850, 2, 2, 2, 'Canada', 'Blue Rd', 'Collingwood', 'Ontario', 'D8K 1D9', True);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 10, 'Messages'),
(2, 2, 2, 8, 'Messages'),
(3, 3, 3, 9, 'Messages');