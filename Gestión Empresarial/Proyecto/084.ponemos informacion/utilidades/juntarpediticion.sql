SELECT 
    ist.table_name AS 'Tables_in_crismon1',
    ist.table_comment AS 'Comentario',
    ta.tabla AS 'Tabla_de_Aplicacion'
FROM
    information_schema.tables AS ist
LEFT JOIN
    tablasaplicaciones AS ta
ON 
    ist.table_name = ta.tabla
LEFT JOIN 
    aplicaciones AS ap
ON 
    ta.aplicaciones_nombre= ap.Identificador  
WHERE 
    ist.table_schema = 'crismon1'
    AND ap.nombre = 'gestion de ventas';


SELECT 
    ist.table_name AS 'Tables_in_'.$this->basededatos.,
    ist.table_comment AS 'Comentario',
    ta.tabla AS 'Tabla_de_Aplicacion'
FROM
    information_schema.tables AS ist
LEFT JOIN
    tablasaplicaciones AS ta
ON 
    ist.table_name = ta.tabla
LEFT JOIN 
    aplicaciones AS ap
ON 
    ta.aplicaciones_nombre= ap.Identificador  
WHERE 
    ist.table_schema = '".$this->basededatos."'
    AND ap.nombre = 'gestion de ventas';