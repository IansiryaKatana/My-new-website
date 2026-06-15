--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: accommodation_rooms; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: accommodations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: airport_pickups; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: asset_issuances; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.attendance VALUES
	('f323d96a-1e3d-44f4-8ef3-bbfe6f630655', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-06-01', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('bfa5bec0-7b0b-4349-a866-aa45b0ab1528', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-06-01', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ef40e09e-a75d-4981-b84e-8efc9cf5b5f4', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-06-01', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('530b669c-781c-4b94-aa33-0a4ced534e3a', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-06-01', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('3aecc453-3db7-46b3-8b55-90c5d9175ed3', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-06-01', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('24241d20-0d13-4864-b5e1-9f2312184c12', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-31', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('36239d7f-1951-4842-abc2-5d5b9f5ef407', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-31', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('866a2f47-f37e-4785-957d-b70d3b7e7d29', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-31', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('e23a7655-15e0-43cf-bbf2-eeb2db90da52', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-31', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ca5eb102-a523-46e9-a803-8652ef83310a', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-31', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('3f8582df-4e2c-48d4-aeb0-ed1b53be40ef', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-30', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('02afc382-f9ad-485a-bfbd-b326eff92a72', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-30', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('fc85dff5-bf26-47f9-99e3-3607e20c9fe4', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-30', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('116bcb5e-1b1f-4d79-b2a5-ed7556d86496', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-30', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('2addff55-f212-4a2f-9de8-ea1876843449', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-30', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('64945e4a-6cb8-46db-84eb-15ed64218ee9', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-29', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('302af29e-2f4e-4307-8b9c-f7fc94f905e9', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-29', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ccafd8c8-da8c-4db1-8b65-21211b3b74cb', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-29', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('5ccbb9f0-5771-4195-a6b2-ca5523611e22', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-29', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ed8e7129-f6be-4c1a-8f01-b2b5b16fbc3b', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-29', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('84584fe9-e35d-4eb0-92db-ec1cd0689fcd', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-28', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('21bf3b74-f167-4cb2-9b85-9d4eb3300098', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-28', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('9d82cd05-0c2f-4589-ad49-988fa8e9fcd3', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-28', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('008da9fb-a2d4-46fb-ba0e-51ce26578c45', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-28', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('b6c1229a-1359-4606-bc03-9f7b01b73bdf', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-28', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('1f9fc3cc-a501-4fb4-b1c7-e30d662504b1', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-27', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('98b821f3-5648-47d4-a365-a8d60af9848f', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-27', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('0ff026a8-cbe2-4416-9f3d-161aa507dbf7', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-27', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('43821f06-b51d-4c48-b236-1597d100a8c9', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-27', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('45ca68ee-50fc-47de-8fa8-574eb1109dc8', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-27', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ebee4271-9e6b-453a-a8ee-609d481a9a11', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-26', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('f2ca7841-20e8-4339-a0a8-e6917d84df1f', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-26', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('2d11f5b8-8fb5-40e7-937d-98176394749e', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-26', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('aa4b245a-0819-4168-a3e1-3c49f5228c5f', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-26', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('557e8996-4f27-4d30-a119-9c2940045fa7', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-26', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('d5908ee9-5710-4653-a25e-f1516f6b0a11', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-25', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('3f09f983-e919-4982-b817-eb27365b755b', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-25', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('c7278f02-d906-4d99-9da0-fb152ad2eb3d', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-25', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('2107434a-9b29-4329-aabc-546ad9016719', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-25', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('429aebd0-e2b0-43e7-9633-a4f5f1cec203', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-25', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('cd0dfb81-81c6-4ba8-9af5-2547a1c91c3e', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-24', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('8e52a1db-90f8-4787-be54-754de9e5b425', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-24', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('058b8dca-3006-4716-a33f-88d91c3fce84', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-24', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('89ea380b-3ce0-40bf-81eb-f272230eb8f2', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-24', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('69219747-2c2e-4be8-ae9e-99a025527d23', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-24', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('d7104434-cb72-4b62-b551-3eb226e1600e', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-23', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('0b58391a-a8cc-4e97-bced-e90daca1eec8', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-23', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('79feedf1-c97e-4f69-9aec-eabf6d51b82c', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-23', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('e977fff0-a4b4-4730-a760-6d954a8e38ab', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-23', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('35a5f8b1-f05e-40fe-8e97-21dffa4230d4', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-23', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('5b3cf3ed-f89f-4876-8344-eb12d4bdb72d', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-22', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('892b6f94-8e06-4236-8204-716d59e058fe', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-22', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('c5d981ea-206d-4809-bcab-f4adf869a661', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-22', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('7edccfb7-f4cb-4f9c-b9d7-4714b2004eb6', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-22', 'off', 0.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('56fab3e5-54da-44f0-ad04-46cf35d6c31a', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-22', 'off', 0.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('6e336848-deb9-4720-b9c8-baa316ea7d88', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-21', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('231ec0fd-49af-4cf8-905a-c91c39fbd4ca', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-21', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('bc069fcb-f318-4580-8437-76e18fad2b32', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-21', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('84db9cce-fd08-4162-bc82-4c9cbe9e6799', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-21', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('eada726d-3e1a-45c2-9a49-9f5ef9e689b2', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-21', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('db541de6-792f-44cf-ae6c-8b5e7f904cbb', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-20', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('3f35433f-967f-4212-acde-b519172460df', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-20', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('6709abb8-2881-4b05-b673-5c275fa6210c', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-20', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('bfacd6a7-e6fd-4a9c-92c0-4c84af9dbbfb', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-20', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('cd4b5454-451a-4e95-b2a7-88409d9be6b6', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-20', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('0b766f32-d24d-4848-8742-3a4e8144c9d2', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '2026-05-19', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ab97c7f0-3ff0-40fe-a6e3-26fceb5c5cc1', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '2026-05-19', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('df4cfd42-9887-4f33-9e2b-9735ad187074', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '2026-05-19', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('4ccda94d-1bdb-4920-bc2c-9c95741911be', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '2026-05-19', 'present', 9.00, 0.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('94b99523-41f0-4a5c-b22c-865c4c7dd84d', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '2026-05-19', 'present', 9.00, 2.00, 'Dubai Marina Site', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: bed_assignments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: -
--

UPDATE public.branding_settings SET
  company_name = 'EmirAxis',
  short_name = 'EmirAxis',
  tagline = 'The command center for UAE workforce operations.',
  logo_url = '/assets/emiraxis-logo.svg',
  logo_dark_url = '/assets/emiraxis-logo-white.svg',
  favicon_url = '/assets/emiraxis-favicon.png',
  primary_color = 'oklch(0.28 0.09 252)',
  accent_color = 'oklch(0.78 0.13 85)',
  background_color = 'oklch(0.985 0.005 85)',
  foreground_color = 'oklch(0.2 0.04 252)',
  font_family = 'Geist',
  font_display_family = 'Geist',
  font_weights = '100;200;300',
  updated_at = now()
WHERE singleton = true;

-- profiles + user_roles: created by auth signup trigger (see scripts/seed-database.mjs)

--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.clients VALUES
	('333e63b3-af9b-4a79-9523-7aeca01b7db8', 'Emaar Hospitality Group LLC', 'Emaar Hospitality', 'Hospitality', NULL, NULL, NULL, 'AE', 'Dubai', 'Downtown Dubai', NULL, NULL, 'procurement@emaar.ae', '+97144567890', 30, 500000.00, 'AED', 'active', NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('744c5407-3632-4da1-af87-50cb1870c384', 'DP World UAE Region FZE', 'DP World', 'Logistics', NULL, NULL, NULL, 'AE', 'Dubai', 'Jebel Ali', NULL, NULL, 'staffing@dpworld.com', '+97148810000', 45, 1200000.00, 'AED', 'active', NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('32180d9f-0c03-4af5-a97e-b48d7d98e5a1', 'Aldar Properties PJSC', 'Aldar', 'Real Estate', NULL, NULL, NULL, 'AE', 'Abu Dhabi', 'Yas Island', NULL, NULL, 'hr@aldar.com', '+97128109999', 30, 750000.00, 'AED', 'active', NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('eba853ab-c226-4ec7-a863-e4e4c702caa4', 'Majid Al Futtaim Retail LLC', 'Carrefour MAF', 'Retail', NULL, NULL, NULL, 'AE', 'Dubai', 'Deira', NULL, NULL, 'careers@maf.ae', '+97142943100', 30, 0.00, 'AED', 'prospect', NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('f1859705-a8f4-472e-8d71-a5b14c2d5cc7', 'Etihad Airport Services', 'EAS', 'Aviation', NULL, NULL, NULL, 'AE', 'Abu Dhabi', 'Abu Dhabi Intl', NULL, NULL, 'ops@etihadairportservices.ae', '+97125998888', 60, 900000.00, 'AED', 'active', NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00');


--
-- Data for Name: job_orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.job_orders VALUES
	('40597068-2d9a-4c4d-9785-aebf959d0607', 'JO-2026-000001', '333e63b3-af9b-4a79-9523-7aeca01b7db8', 'Housekeeping Attendants', 'Hospitality', '50 housekeepers for Address Hotel pre-opening', 50, 0, 'Downtown', 'Dubai', 'limited', '2026-06-15', NULL, 9.00, 1500.00, 2400.00, 'AED', 'high', 'open', 21, '{}', NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('9af038c3-c521-46dc-b134-bcbe0ff0a18c', 'JO-2026-000002', '744c5407-3632-4da1-af87-50cb1870c384', 'Crane Operators', 'Logistics', 'Certified RTG crane operators for Jebel Ali Terminal 4', 12, 0, 'Jebel Ali', 'Dubai', 'limited', '2026-06-08', NULL, 9.00, 5500.00, 8200.00, 'AED', 'urgent', 'open', 14, '{}', NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('995ca835-3ac4-4d86-8bd6-5ad152f8bc4a', 'JO-2026-000003', '32180d9f-0c03-4af5-a97e-b48d7d98e5a1', 'Security Guards (SIRA)', 'Security', '30 SIRA-certified guards for Yas Mall', 30, 0, 'Yas Island', NULL, 'limited', '2026-07-01', NULL, 9.00, 2200.00, 3500.00, 'AED', 'normal', 'in_progress', 14, '{}', NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('cf916b9e-5f76-4dd3-9edc-24123863c851', 'JO-2026-000004', 'f1859705-a8f4-472e-8d71-a5b14c2d5cc7', 'Baggage Handlers', 'Aviation', NULL, 80, 0, 'AUH Terminal A', NULL, 'limited', '2026-06-22', NULL, 9.00, 2800.00, 4200.00, 'AED', 'high', 'draft', 14, '{}', NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00');


--
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.candidates VALUES
	('2aa603b7-c38a-4980-aaaf-2a18818144ef', 'CN-26000001', 'Rajesh Kumar', 'rajesh.k@example.com', '+919876543210', NULL, NULL, 'Male', 'Indian', NULL, NULL, 'India', NULL, NULL, NULL, '{English,Hindi}', '{Housekeeping,"Front Desk"}', 6.0, NULL, 3500.00, NULL, NULL, 'shortlisted', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL),
	('beb0c9bb-2577-462a-b1ea-f0789bd2d0dc', 'CN-26000002', 'Maria Santos', 'maria.santos@example.com', '+639171234567', NULL, NULL, 'Female', 'Filipino', NULL, NULL, 'Philippines', NULL, NULL, NULL, '{English,Tagalog}', '{Waitress,Barista}', 4.0, NULL, 3000.00, NULL, NULL, 'new', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL),
	('bbb8496a-b86b-4a3b-8e46-12f94f0a7ac9', 'CN-26000003', 'Ahmed Hassan', 'ahmed.hassan@example.com', '+201111223344', NULL, NULL, 'Male', 'Egyptian', NULL, NULL, 'UAE', NULL, NULL, NULL, '{Arabic,English}', '{Driver,"Heavy Equipment"}', 9.0, NULL, 6000.00, NULL, NULL, 'interviewing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL),
	('c7a62b69-3e50-4dfa-b4f3-5f39166adbd1', 'CN-26000004', 'Priya Sharma', 'priya.sharma@example.com', '+919812345678', NULL, NULL, 'Female', 'Indian', NULL, NULL, 'India', NULL, NULL, NULL, '{English,Hindi}', '{Receptionist,Admin}', 3.0, NULL, 2800.00, NULL, NULL, 'screening', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL),
	('ea613add-7fbc-4ffa-8e85-cedbcea57267', 'CN-26000005', 'John Otieno', 'john.otieno@example.com', '+254712345678', NULL, NULL, 'Male', 'Kenyan', NULL, NULL, 'Kenya', NULL, NULL, NULL, '{English,Swahili}', '{Security,"First Aid"}', 5.0, NULL, 3200.00, NULL, NULL, 'offered', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL),
	('a2271350-511d-4765-b037-26ee3e8c978a', 'CN-26000006', 'Nguyen Linh', 'linh.nguyen@example.com', '+84909123456', NULL, NULL, 'Female', 'Vietnamese', NULL, NULL, 'Vietnam', NULL, NULL, NULL, '{English,Vietnamese}', '{"Spa Therapist"}', 2.0, NULL, 2500.00, NULL, NULL, 'new', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL);


--
-- Data for Name: candidate_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: client_contacts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: contract_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: internal_tasks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.invoices VALUES
	('d6a8d58d-f118-4f9c-a933-44a04802cc41', 'INV-2026-000015', '32180d9f-0c03-4af5-a97e-b48d7d98e5a1', '2026-05-02', '2026-06-01', '2026-06-01', '2026-07-01', 'sent', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('1c54fb95-badd-4e96-a9aa-318ad20726c7', 'INV-2026-000016', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-04-02', '2026-05-02', '2026-05-02', '2026-06-01', 'partial', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('9f760a6b-aee4-4df1-a3a7-92fc46a578fe', 'INV-2026-000017', '744c5407-3632-4da1-af87-50cb1870c384', '2026-04-02', '2026-05-02', '2026-05-02', '2026-06-01', 'partial', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('80e1caf7-0e1b-4668-9f86-ea45d6ce230e', 'INV-2026-000018', '32180d9f-0c03-4af5-a97e-b48d7d98e5a1', '2026-04-02', '2026-05-02', '2026-05-02', '2026-06-01', 'partial', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('61c16d6a-11f0-4554-87cd-78d87f8f6207', 'INV-2026-000019', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-03-03', '2026-04-02', '2026-04-02', '2026-05-02', 'paid', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('076cd3f5-4858-4ce3-830f-a1d195882258', 'INV-2026-000020', '744c5407-3632-4da1-af87-50cb1870c384', '2026-03-03', '2026-04-02', '2026-04-02', '2026-05-02', 'paid', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('5ed970ce-5c55-4b41-b7f0-1440336a5674', 'INV-2026-000021', '32180d9f-0c03-4af5-a97e-b48d7d98e5a1', '2026-03-03', '2026-04-02', '2026-04-02', '2026-05-02', 'paid', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('710f5359-5f37-4206-8eb2-31c159e2237c', 'INV-2026-000022', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-02-01', '2026-03-03', '2026-03-03', '2026-04-02', 'overdue', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('d9a831c5-6bb1-4be4-9930-faee690680d1', 'INV-2026-000023', '744c5407-3632-4da1-af87-50cb1870c384', '2026-02-01', '2026-03-03', '2026-03-03', '2026-04-02', 'overdue', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('7ee80542-a0ed-486a-bb55-eb7c98002ae5', 'INV-2026-000024', '32180d9f-0c03-4af5-a97e-b48d7d98e5a1', '2026-02-01', '2026-03-03', '2026-03-03', '2026-04-02', 'overdue', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('41baf9dc-c48d-443f-8dcf-efd50f50dc86', 'INV-2026-000013', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-05-02', '2026-06-01', '2026-06-01', '2026-07-01', 'sent', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('58b4c321-816d-4eba-a742-5b569cdf5080', 'INV-2026-000014', '744c5407-3632-4da1-af87-50cb1870c384', '2026-05-02', '2026-06-01', '2026-06-01', '2026-07-01', 'sent', 13500.00, 5.00, 675.00, 14175.00, 0.00, 'AED', 'Monthly staffing services', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: workers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.workers VALUES
	('4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', 'EMP000001', NULL, NULL, 'Suresh Patel', NULL, NULL, NULL, 'Indian', NULL, 'Male', NULL, '2027-06-16', NULL, '2026-12-18', NULL, '2026-06-26', NULL, '2026-09-04', '2026-07-16', '2027-03-28', 'Hospitality', 'Housekeeping Attendant', '2025-12-03', '2025-12-03', '2027-11-23', 1200.00, 300.00, 200.00, 0.00, 'AED', 'Emirates NBD', 'AE070331234567890123456', NULL, NULL, NULL, 'active', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL, NULL, NULL),
	('42172aa3-5199-431a-aba1-e334b7405705', 'EMP000002', NULL, NULL, 'Fatima Begum', NULL, NULL, NULL, 'Bangladeshi', NULL, 'Female', NULL, '2028-05-21', NULL, '2027-07-16', NULL, '2026-06-19', NULL, '2026-07-31', '2026-06-13', '2027-06-01', 'Facilities', 'Cleaner', '2026-02-26', '2026-02-26', '2028-02-26', 1100.00, 250.00, 150.00, 0.00, 'AED', 'ADCB', 'AE860030001122334455667', NULL, NULL, NULL, 'active', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL, NULL, NULL),
	('bef62375-4649-4e8f-a04d-f9c0f4506c65', 'EMP000003', NULL, NULL, 'Mohammed Iqbal', NULL, NULL, NULL, 'Pakistani', NULL, 'Male', NULL, '2026-12-18', NULL, '2026-11-28', NULL, '2026-09-29', NULL, '2027-02-06', '2026-08-20', '2027-07-26', 'Logistics', 'Crane Operator', '2025-06-01', '2025-06-01', '2027-06-01', 4500.00, 1200.00, 600.00, 0.00, 'AED', 'Mashreq', 'AE220330099887766554433', NULL, NULL, NULL, 'active', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL, NULL, NULL),
	('c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'EMP000004', NULL, NULL, 'Daniel Mwangi', NULL, NULL, NULL, 'Kenyan', NULL, 'Male', NULL, '2028-05-01', NULL, '2028-05-01', NULL, '2028-05-01', NULL, '2028-05-01', '2028-05-01', '2028-08-09', 'Security', 'Security Guard', '2026-05-18', '2026-05-18', '2028-05-17', 1800.00, 400.00, 200.00, 0.00, 'AED', 'FAB', 'AE100354512345678901234', NULL, NULL, NULL, 'onboarding', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL, NULL, NULL),
	('435c25a3-1b0f-42f4-9645-81e2b77b34ce', 'EMP000005', NULL, NULL, 'Aliya Khan', NULL, NULL, NULL, 'Indian', NULL, 'Female', NULL, '2029-02-25', NULL, '2027-03-08', NULL, '2027-10-14', NULL, '2027-04-17', '2026-10-29', '2028-01-22', 'Admin', 'Receptionist', '2024-06-01', '2025-06-01', '2027-06-01', 2200.00, 600.00, 300.00, 0.00, 'AED', 'Emirates NBD', 'AE070331234567899876543', NULL, NULL, NULL, 'active', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00', NULL, NULL, NULL);


--
-- Data for Name: placements; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.placements VALUES
	('b34c83de-d66c-462a-9b62-2e04e323e052', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', '9af038c3-c521-46dc-b134-bcbe0ff0a18c', '744c5407-3632-4da1-af87-50cb1870c384', '2026-05-02', NULL, 5500.00, 8200.00, 'AED', 'active', NULL, NULL, '2026-06-01 05:30:11.961587+00', '2026-06-01 05:30:11.961587+00'),
	('3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '40597068-2d9a-4c4d-9785-aebf959d0607', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-03-03', '2027-02-26', 45.00, 75.00, 'AED', 'confirmed', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('403a3624-2f50-476e-b536-4eaf50557e09', '42172aa3-5199-431a-aba1-e334b7405705', '40597068-2d9a-4c4d-9785-aebf959d0607', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-03-03', '2027-02-26', 45.00, 75.00, 'AED', 'confirmed', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('feccebbd-adf0-4574-ad90-df034b3ab5e9', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', '40597068-2d9a-4c4d-9785-aebf959d0607', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-03-03', '2027-02-26', 45.00, 75.00, 'AED', 'confirmed', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('8d198a66-25d7-4448-986b-1272048a8780', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '40597068-2d9a-4c4d-9785-aebf959d0607', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-03-03', '2027-02-26', 45.00, 75.00, 'AED', 'confirmed', NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: invoice_lines; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.invoice_lines VALUES
	('c6284ecc-2c4b-4cb4-b5b3-17828d5059eb', '41baf9dc-c48d-443f-8dcf-efd50f50dc86', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('a06b507c-f164-4e71-96a2-5ba1680b3a89', '58b4c321-816d-4eba-a742-5b569cdf5080', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('24dd7482-5449-48d5-9d9f-db6e3cf05748', 'd6a8d58d-f118-4f9c-a933-44a04802cc41', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('07065a75-ddaa-43c9-a4b0-a44b97994b50', '1c54fb95-badd-4e96-a9aa-318ad20726c7', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('17cd98b7-784a-4391-8f85-cbbee4c6b46d', '9f760a6b-aee4-4df1-a3a7-92fc46a578fe', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('d378fc01-e9a3-4ba5-a457-7bd373a2f72f', '80e1caf7-0e1b-4668-9f86-ea45d6ce230e', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('c22ce10d-8640-4178-949c-be9b450a7ef7', '61c16d6a-11f0-4554-87cd-78d87f8f6207', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('f5b9a1a1-f11c-4079-8f30-4bdb808e3f35', '076cd3f5-4858-4ce3-830f-a1d195882258', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('2c434115-9713-43fc-b001-c1d6b45bf640', '5ed970ce-5c55-4b41-b7f0-1440336a5674', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('e41b90b1-d3f3-4564-ab03-faae1b6841a5', '710f5359-5f37-4206-8eb2-31c159e2237c', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('1d38e98d-12e9-4d15-831b-f26997f31b26', 'd9a831c5-6bb1-4be4-9930-faee690680d1', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00'),
	('bb4eef6c-6c93-4471-b420-17ca83e2a4cc', '7ee80542-a0ed-486a-bb55-eb7c98002ae5', NULL, NULL, 'Hours billed', 180.00, 75.00, 13500.00, '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issues VALUES
	('61f5c026-603e-4df3-9763-75251d821b6c', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', NULL, 'welfare', 'high', 'resolved', 'Medical card missing', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('a3a7b818-4593-4880-b060-de37d4c90480', '42172aa3-5199-431a-aba1-e334b7405705', NULL, 'transport', 'high', 'resolved', 'Visa stamping needed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('6710f8c6-850a-4d33-9299-0997eda20b38', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', NULL, 'transport', 'medium', 'in_progress', 'Visa stamping needed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('ac693491-9e2d-4c3c-ac8d-b1f9394949b9', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', NULL, 'welfare', 'medium', 'resolved', 'Transport delayed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('313f7fda-8acd-4cfb-8be9-6d0d32623053', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', NULL, 'hr', 'high', 'resolved', 'Site PPE shortage', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('aa04d344-6b99-44b9-ae87-1c61ec90a89e', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', NULL, 'safety', 'low', 'in_progress', 'Visa stamping needed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('c9ad7c0d-abe2-4bab-9c12-efe5a148f358', '42172aa3-5199-431a-aba1-e334b7405705', NULL, 'hr', 'medium', 'in_progress', 'Late salary payment', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('9171667f-8392-4a0a-a9db-ea24f0b596b0', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', NULL, 'safety', 'medium', 'in_progress', 'Medical card missing', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('f31dad86-9584-4da4-8370-f37460696c0b', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', NULL, 'payroll', 'high', 'resolved', 'Transport delayed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('edc45ca4-7877-4d12-9d8e-768ae760dceb', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', NULL, 'safety', 'medium', 'in_progress', 'Visa stamping needed', 'Reported on site - awaiting management review.', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: issue_comments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.leave_requests VALUES
	('07f49ec4-87e0-47f2-bd9c-a088313a29d3', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'annual', '2026-06-08', '2026-06-15', 7.0, 'Family visit', 'pending', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('942f9eb8-19e7-4849-b13b-ac86ac49ea1e', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', 'annual', '2026-06-08', '2026-06-15', 7.0, 'Family visit', 'pending', NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('6d43db00-8df8-42a4-8b9c-711c8342221d', '42172aa3-5199-431a-aba1-e334b7405705', 'sick', '2026-05-02', '2026-05-04', 3.0, 'Flu - medical attached', 'approved', NULL, '2026-05-07 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('d5eff34c-fc10-4543-bf3a-39939ee5f6cf', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', 'annual', '2026-06-08', '2026-06-15', 7.0, 'Family visit', 'rejected', '{{ADMIN_USER_ID}}', '2026-06-01 10:00:44.494+00', 'You are stupid', '2026-06-01 07:33:28.973765+00', '2026-06-01 10:00:44.904949+00'),
	('ce1f3540-d57b-4c2c-a319-ef5fb48eb23a', '42172aa3-5199-431a-aba1-e334b7405705', 'annual', '2026-06-08', '2026-06-15', 7.0, 'Family visit', 'approved', '{{ADMIN_USER_ID}}', '2026-06-01 10:00:55.202+00', 'Because i love you', '2026-06-01 07:33:28.973765+00', '2026-06-01 10:00:55.606345+00');


--
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: message_templates; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.message_templates VALUES
	('69d33ac7-523a-4cd8-9d46-f18e71cf54d0', 'Medical Appointment Reminder', 'whatsapp', 'medical', 'Dear {{name}}, your medical appointment is scheduled at {{center}} on {{date}}. Please bring your passport copy.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00'),
	('c48ac339-4ff1-4859-a1b9-ce385b66bfbf', 'Visa Renewal Reminder', 'whatsapp', 'visa', 'Dear {{name}}, your visa expires on {{date}}. Please submit your passport for renewal.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00'),
	('f1ee9f7c-82ce-49ae-8b31-7003c0e32e40', 'Airport Pickup', 'whatsapp', 'arrival', 'Welcome to UAE! Driver {{driver}} ({{plate}}) will pick you up at Terminal {{terminal}}.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00'),
	('20bc5072-a63b-4f22-8b7a-db7a69f53cf6', 'Payslip Issued', 'whatsapp', 'payroll', 'Dear {{name}}, your payslip for {{month}} has been issued. Net pay: AED {{net}}.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00'),
	('cb4fb5e8-19e0-4656-9d86-24aae7d01fdb', 'Warning Letter Notice', 'whatsapp', 'disciplinary', 'Dear {{name}}, a {{type}} warning has been issued. Please report to HR.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00'),
	('19d65067-1a7d-41bf-8f26-649d58c8c140', 'Deployment Confirmation', 'whatsapp', 'deployment', 'Dear {{name}}, you are deployed to {{client}} starting {{date}}. Report to {{supervisor}}.', true, '2026-06-01 10:14:12.895922+00', '2026-06-01 10:14:12.895922+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notifications VALUES
	('9ca3e899-9c5b-43a6-9cd2-fef6a90430bb', '{{ADMIN_USER_ID}}', 'Pending leave approvals', '4 requests awaiting decision', '/leave-approvals', 'approval', NULL, '2026-06-01 07:33:28.973765+00'),
	('65a91e5b-1ab2-49f8-bffd-1f65fac99224', '{{ADMIN_USER_ID}}', 'Overdue invoices', 'You have 3 overdue invoice(s)', '/invoices', 'finance', NULL, '2026-06-01 07:33:28.973765+00'),
	('d3b20752-9ddf-4c58-87a6-7c94c69b847a', '{{ADMIN_USER_ID}}', 'Welcome to EmirAxis', 'Your workspace is ready. Explore dashboards and manage placements.', '/dashboard', 'system', '2026-06-01 07:37:10.345+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: payslips; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payslips VALUES
	('00736ba8-db08-4f4c-b5ee-78657de16a06', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', 2026, 6, 7000.00, 450.00, 6550.00, 'AED', 'draft', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('0855fd65-3a5a-426a-ba64-b4374b0435d3', '42172aa3-5199-431a-aba1-e334b7405705', 2026, 6, 7000.00, 450.00, 6550.00, 'AED', 'draft', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('82e5639b-2635-4ef5-bb3f-7767059219c4', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 2026, 6, 7000.00, 450.00, 6550.00, 'AED', 'draft', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('466b0fc2-d628-4edb-9283-50fe170da6d1', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 2026, 6, 7000.00, 450.00, 6550.00, 'AED', 'draft', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('0227bb36-29a6-40e3-b57b-8ce6e4314082', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', 2026, 6, 7000.00, 450.00, 6550.00, 'AED', 'draft', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('16a359f0-2846-473e-bdd9-c9dc9d0a72c8', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', 2026, 5, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('20ad8cba-5007-43f7-9599-b4a35d832cdd', '42172aa3-5199-431a-aba1-e334b7405705', 2026, 5, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('a8c07a3e-dd28-4e59-9ed8-9f28229c57b5', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 2026, 5, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('26f05800-35e5-4e08-b671-7f6fcda5b020', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 2026, 5, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('b212dc5b-6054-487e-9b52-df67e0acd48b', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', 2026, 5, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('16da8c8d-e3f4-4010-b756-0c04fae4cec0', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', 2026, 4, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('cb69b667-6fca-4e64-b2d2-aced470ce709', '42172aa3-5199-431a-aba1-e334b7405705', 2026, 4, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('f4187f3f-3bee-4795-8d54-8f40a4c4c158', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 2026, 4, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('4ba1c811-2c7e-40fa-9d71-d7df7de0e9be', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 2026, 4, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('90da479f-4f34-4e64-bed1-ea9093780620', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', 2026, 4, 7000.00, 450.00, 6550.00, 'AED', 'paid', '[{"label": "Basic", "amount": 5500}, {"label": "Housing", "amount": 1000}, {"label": "Transport", "amount": 500}]', NULL, NULL, NULL, NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: pro_tasks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: recruitment_agents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: timesheets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.timesheets VALUES
	('926a643c-cfe9-49d4-9e11-3638cc25677c', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '744c5407-3632-4da1-af87-50cb1870c384', '2026-06-01', '2026-06-30', 205.00, 0.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('1ba8e262-a6fa-4362-8a56-dc605a68a96b', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-06-01', '2026-06-30', 181.00, 4.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('8ed2cd5a-bb37-448d-aebf-2cbb156e36a9', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-06-01', '2026-06-30', 199.00, 10.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('83bef65d-7e18-4206-820a-38c86d58ff61', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-06-01', '2026-06-30', 189.00, 10.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('1e4d4c71-d550-4601-881e-b4f115b3597c', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-06-01', '2026-06-30', 201.00, 9.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('88f97fed-9bd3-4052-bcaf-b333232b0e68', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '744c5407-3632-4da1-af87-50cb1870c384', '2026-05-01', '2026-05-31', 195.00, 6.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('a8979cf2-f55b-4182-a37a-d5ebbe40e0d0', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-05-01', '2026-05-31', 196.00, 11.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('6c2d9e7f-88a0-4221-a294-72a7754a229f', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-05-01', '2026-05-31', 185.00, 8.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('c0c6cf54-d85e-474a-b1d5-13206fc15d2d', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-05-01', '2026-05-31', 209.00, 6.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('38628787-7585-4221-bfe5-75e0693a4243', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-05-01', '2026-05-31', 192.00, 6.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('f3a34459-f31a-470f-a8be-d00f94a37ffe', 'bef62375-4649-4e8f-a04d-f9c0f4506c65', 'b34c83de-d66c-462a-9b62-2e04e323e052', '744c5407-3632-4da1-af87-50cb1870c384', '2026-04-01', '2026-04-30', 190.00, 5.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('d06eaa44-8c60-4708-871d-262a23a9e620', '4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db', '3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-04-01', '2026-04-30', 198.00, 2.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('142b0511-2d0d-49ca-b91f-34b177542ee5', '42172aa3-5199-431a-aba1-e334b7405705', '403a3624-2f50-476e-b536-4eaf50557e09', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-04-01', '2026-04-30', 187.00, 7.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('528066dc-5c59-4fd3-a01c-da4e8b8ebdf9', 'c74b802b-e34c-424a-8df2-1b5bdc2f22dc', 'feccebbd-adf0-4574-ad90-df034b3ab5e9', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-04-01', '2026-04-30', 195.00, 7.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00'),
	('3f0039bb-ad76-4045-9c16-71fb94cab5de', '435c25a3-1b0f-42f4-9645-81e2b77b34ce', '8d198a66-25d7-4448-986b-1272048a8780', '333e63b3-af9b-4a79-9523-7aeca01b7db8', '2026-04-01', '2026-04-30', 204.00, 6.00, 13500.00, 'AED', 'approved', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', NULL, '2026-06-01 07:33:28.973765+00', '2026-06-01 07:33:28.973765+00');


--
-- Data for Name: transport_routes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: uae_banks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.uae_banks VALUES
	('1fdeb342-fee8-40cf-aa0f-03076405b5d3', 'Emirates NBD Bank', 'ENBD', 'EBIL', 'EBILAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.emiratesnbd.com', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('8f978637-2f54-4f13-b77b-2e592c101339', 'First Abu Dhabi Bank', 'FAB', 'NBAD', 'NBADAEAA', NULL, 'AE', 'Abu Dhabi', NULL, 'https://www.bankfab.com', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('0f160117-24e9-4f11-96bc-125da3cd5c42', 'Abu Dhabi Commercial Bank', 'ADCB', 'ADCB', 'ADCBAEAA', NULL, 'AE', 'Abu Dhabi', NULL, 'https://www.adcb.com', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('54415be9-1cfa-4f6e-9816-50d80a67cd41', 'Dubai Islamic Bank', 'DIB', 'DUIB', 'DUIBAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.dib.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('41399f9e-a916-4784-b81d-a93f10eee5bc', 'Abu Dhabi Islamic Bank', 'ADIB', 'ABDI', 'ABDIAEAD', NULL, 'AE', 'Abu Dhabi', NULL, 'https://www.adib.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('4d11763d-eff5-4ad4-831c-5b5b9dc543d0', 'Mashreq Bank', 'Mashreq', 'BOML', 'BOMLAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.mashreqbank.com', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('69532c89-4b5b-4080-a1e1-4d08a14c35e4', 'Commercial Bank of Dubai', 'CBD', 'CBDU', 'CBDUAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.cbd.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('37713609-9a8f-4dd4-b04f-189be7cb5d64', 'RAKBANK', 'RAKBANK', 'NRAK', 'NRAKAEAK', NULL, 'AE', 'Ras Al Khaimah', NULL, 'https://www.rakbank.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('d60c2146-ee34-4e13-af0b-340f8c9906e1', 'Emirates Islamic Bank', 'EI', 'MEBL', 'MEBLAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.emiratesislamic.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('64fc169c-2854-409c-9588-fb04e94f07de', 'Sharjah Islamic Bank', 'SIB', 'NBSH', 'NBSHAEAS', NULL, 'AE', 'Sharjah', NULL, 'https://www.sib.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('8e440bba-8838-46c2-957f-7a26c26bff7d', 'Bank of Sharjah', 'BOS', 'BSHJ', 'BSHJAESH', NULL, 'AE', 'Sharjah', NULL, 'https://www.bankofsharjah.com', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('0eb97679-66bf-4a50-822c-ddd150c24ae0', 'National Bank of Fujairah', 'NBF', 'NBFU', 'NBFUAEAF', NULL, 'AE', 'Fujairah', NULL, 'https://www.nbf.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('0f3b3e57-c93f-48b7-a590-3ede7b150d27', 'United Arab Bank', 'UAB', 'UABL', 'UABLAEAA', NULL, 'AE', 'Sharjah', NULL, 'https://www.uab.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('a2b9c575-fe7e-46c4-be05-cea652bb8142', 'Ajman Bank', 'AJB', 'AJMA', 'AJMAAEAJ', NULL, 'AE', 'Ajman', NULL, 'https://www.ajmanbank.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('bf3d4256-f124-4a80-989f-360a8ba1cad6', 'Al Hilal Bank', 'AHB', 'ALHI', 'ALHIAEAA', NULL, 'AE', 'Abu Dhabi', NULL, 'https://www.alhilalbank.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('15eded1e-6ebd-438a-9634-a77726f05708', 'HSBC Bank Middle East', 'HSBC', 'BBME', 'BBMEAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.hsbc.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('85cbd802-1ffe-464a-bb04-e2126f117965', 'Standard Chartered Bank UAE', 'SCB', 'SCBL', 'SCBLAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.sc.com/ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('b0758291-cb19-4b75-bd32-1592d3c65bc5', 'Citibank UAE', 'Citi', 'CITI', 'CITIAEAD', NULL, 'AE', 'Dubai', NULL, 'https://www.citibank.ae', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('1bad9854-d718-4a6e-a8c1-cd2e388b1a53', 'Wio Bank', 'Wio', 'WIOB', 'WIOBAEAA', NULL, 'AE', 'Abu Dhabi', NULL, 'https://www.wio.io', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00'),
	('e246285e-eac4-45be-9b97-14e3445764b0', 'Liv Bank', 'Liv', 'LIVB', NULL, NULL, 'AE', 'Dubai', NULL, 'https://www.liv.me', true, '2026-06-01 07:17:54.430597+00', '2026-06-01 07:17:54.430597+00');


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: visa_records; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: warning_letters; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: candidate_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.candidate_seq', 6, true);


--
-- Name: invoice_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.invoice_seq', 24, true);


--
-- Name: job_order_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_order_seq', 4, true);


--
-- Name: worker_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.worker_seq', 5, true);


--
-- PostgreSQL database dump complete
--


