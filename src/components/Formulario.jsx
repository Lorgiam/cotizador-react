import React, { useState } from "react";
import styled from "@emotion/styled";
import { obtenerDiferenciaYear, calcularMarca, obtenerPlan } from "../helper";
import PropTypes from "prop-types";
const Campo = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const Label = styled.label`
  flex: 0 0 100px;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  -webkit-appearance: none;
`;

const InputRadio = styled.input`
  margin: 0 1rem;
`;

const Boton = styled.button`
  background-color: #00838f;
  font-size: 16px;
  width: 100%;
  padding: 1rem;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  margin-top: 3rem;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #26c6da;
    cursor: pointer;
  }
`;

const Error = styled.div`
  background-color: red;
  color: white;
  padding: 1rem;
  width: 100%;
  text-align: center;
  margin-bottom: 3rem;
`;

const Formulario = ({ guardarResumen, guardarCargando }) => {
  const [datos, guardarDatos] = useState({
    marca: "",
    year: "",
    plan: ""
  });
  const [error, setError] = useState(false);

  // Extraer los valores del State
  const { marca, year, plan } = datos;

  const handleChange = e => {
    guardarDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  const cotizarSeguro = e => {
    e.preventDefault();

    // Validar Formulario
    if (
      marca === "--Seleccione--" ||
      marca.trim() === "" ||
      year === "--Seleccione--" ||
      year.trim() === "" ||
      plan === ""
    ) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    let resultado = 2000;
    // Obtener la diferencia de años
    const diferencia = obtenerDiferenciaYear(year);
    // por cada año hay que restar el 3%
    resultado -= (diferencia * 3 * resultado) / 100;
    // Americano 15%
    // Asiatico 5%
    // Europeo 30%
    resultado = calcularMarca(marca) * resultado;
    // Basico aumenta 20%
    // Completo 50%
    resultado = parseFloat(obtenerPlan(plan) * resultado).toFixed(2);
    guardarCargando(true);
    setTimeout(() => {
      guardarCargando(false);
      guardarResumen({
        cotizacion: Number(resultado),
        datos
      });
    }, 3000);

    // Total
  };

  return (
    <form onSubmit={cotizarSeguro}>
      {error ? <Error> Todos los Campos son Obligatorios</Error> : null}
      <Campo>
        <Label htmlFor="marca">Marca</Label>
        <Select name="marca" onChange={handleChange} value={marca} id="">
          <option value="">--Seleccione--</option>
          <option value="americano">Americano</option>
          <option value="asiatico">Asiatico</option>
          <option value="europeo">Europeo</option>
        </Select>
      </Campo>
      <Campo>
        <Label htmlFor="">Año</Label>
        <Select name="year" onChange={handleChange} value={year} id="">
          <option value="">-- Seleccione --</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
        </Select>
      </Campo>
      <Campo>
        <Label htmlFor="plan">Plan</Label>
        <InputRadio
          onChange={handleChange}
          type="radio"
          name="plan"
          value="basico"
          checked={plan === "basico"}
        />
        {"Básico"}
        <InputRadio
          onChange={handleChange}
          type="radio"
          name="plan"
          value="completo"
          checked={plan === "completo"}
        />
        {"Completo"}
      </Campo>
      <Boton type="submit">Cotizar</Boton>
    </form>
  );
};

Formulario.propTypes = {
  guardarResumen: PropTypes.func.isRequired,
  guardarCargando: PropTypes.func.isRequired
};
export default Formulario;
