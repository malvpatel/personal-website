SELECT
    e.id,
    e.first_name,
    e.last_name,
    e.gender,
    e.birth_date,
    json (
        json_group_array (DISTINCT p_parents.parent_id) FILTER (
            WHERE
                p_parents.parent_id IS NOT NULL
        )
    ) AS parents,
    json (
        json_group_array (DISTINCT p_children.child_id) FILTER (
            WHERE
                p_children.child_id IS NOT NULL
        )
    ) AS children,
    json (
        json_group_array (
            DISTINCT CASE
                WHEN s.spouse1_id = e.id THEN s.spouse2_id
                WHEN s.spouse2_id = e.id THEN s.spouse1_id
            END
        ) FILTER (
            WHERE
                s.id IS NOT NULL
        )
    ) AS spouses
FROM
    entities e
    LEFT JOIN parentages p_parents ON p_parents.child_id = e.id
    LEFT JOIN parentages p_children ON p_children.parent_id = e.id
    LEFT JOIN spouses s ON s.spouse1_id = e.id
    OR s.spouse2_id = e.id
WHERE
    e.id = 3
GROUP BY
    e.id,
    e.first_name,
    e.last_name,
    e.gender,
    e.birth_date;

-- SELECT
--     e.id,
--     e.first_name,
--     e.last_name,
--     e.gender,
--     e.birth_date,
--     json (
--         json_group_array (DISTINCT p_parents.parent_id) FILTER (
--             WHERE
--                 p_parents.parent_id IS NOT NULL
--         )
--     ) AS parents,
--     json (
--         json_group_array (DISTINCT p_children.child_id) FILTER (
--             WHERE
--                 p_children.child_id IS NOT NULL
--         )
--     ) AS children,
--     json (
--         json_group_array (
--             DISTINCT CASE
--                 WHEN s.spouse1_id = e.id THEN s.spouse2_id
--                 ELSE s.spouse1_id
--             END
--         ) FILTER (
--             WHERE
--                 s.spouse1_id IS NOT NULL
--                 OR s.spouse2_id IS NOT NULL
--         )
--     ) AS spouses
-- FROM
--     entities e
--     LEFT JOIN parentages p_parents ON p_parents.child_id = e.id
--     LEFT JOIN parentages p_children ON p_children.parent_id = e.id
--     LEFT JOIN spouses s ON s.spouse1_id = e.id
--     OR s.spouse2_id = e.id
-- WHERE
--     e.id = 3
-- GROUP BY
--     e.id,
--     e.first_name,
--     e.last_name,
--     e.gender,
--     e.birth_date;