SELECT 
tablasaplicaciones.tabla 
FROM tablasaplicaciones
LEFT JOIN aplicaciones 
ON tablasaplicaciones.aplicaciones_nombre = aplicaciones.Identificador
WHERE aplicaciones.nombre = 'gestion de ventas';