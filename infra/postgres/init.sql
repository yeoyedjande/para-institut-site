-- Base de test des intégrations (vidée par les tests) et extension requise par la contrainte
-- d'exclusion des rendez-vous.
CREATE DATABASE para_official_test OWNER para;
\connect para_official
CREATE EXTENSION IF NOT EXISTS btree_gist;
\connect para_official_test
CREATE EXTENSION IF NOT EXISTS btree_gist;
