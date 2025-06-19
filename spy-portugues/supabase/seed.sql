-- Insert test profiles
INSERT INTO profiles (clerk_user_id, email, full_name, role) VALUES
  ('test_user_1', 'test1@example.com', 'Test User 1', 'user'),
  ('test_user_2', 'test2@example.com', 'Test User 2', 'user'),
  ('admin_user', 'admin@example.com', 'Admin User', 'admin');

-- Insert test competitors
INSERT INTO competitors (user_id, name, website, regions, property_types) VALUES
  ((SELECT id FROM profiles WHERE clerk_user_id = 'test_user_1'), 'Competitor A', 'https://competitora.pt', ARRAY['Lisboa', 'Porto'], ARRAY['Apartamento', 'Moradia']),
  ((SELECT id FROM profiles WHERE clerk_user_id = 'test_user_1'), 'Competitor B', 'https://competitorb.pt', ARRAY['Lisboa'], ARRAY['Apartamento']),
  ((SELECT id FROM profiles WHERE clerk_user_id = 'test_user_2'), 'Competitor C', 'https://competitorc.pt', ARRAY['Porto'], ARRAY['Moradia']);

-- Insert test ads
INSERT INTO ads (competitor_id, platform, ad_id, headline, ad_copy, creative_url, is_active) VALUES
  ((SELECT id FROM competitors WHERE name = 'Competitor A'), 'facebook', 'fb_ad_1', 'Apartamento T2 Lisboa', 'Excelente apartamento no centro de Lisboa', 'https://example.com/ad1.jpg', true),
  ((SELECT id FROM competitors WHERE name = 'Competitor A'), 'instagram', 'ig_ad_1', 'Moradia Porto', 'Moradia familiar com jardim', 'https://example.com/ad2.jpg', true);
