SELECT
aplicaciones.nombre
FROM usuarios

LEFT JOIN departamentos
ON usuarios.departamentos_nombre = departamentos.Identificador

LEFT JOIN departamentosapp
ON departamentosapp.departamento_nombre = departamentos.Identificador

LEFT JOIN aplicaciones
ON departamentosapp.aplicaciones_nombre = aplicaciones.Identificador

WHERE usuarios.usuario = 'compras'