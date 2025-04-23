export interface Province {
  codigo: string;
  nombre: string;
  capital: string;
  poblacion: number;
  superficie: number;
  comunidad: string;
  bounds: [[number, number], [number, number]];
}

export const fallbackProvinces: Province[] = [
  {
    codigo: '28',
    nombre: 'Madrid',
    capital: 'Madrid',
    poblacion: 6663394,
    superficie: 8028,
    comunidad: 'Comunidad de Madrid',
    bounds: [[40.35, -3.9], [40.55, -3.6]]
  },
  {
    codigo: '08',
    nombre: 'Barcelona',
    capital: 'Barcelona',
    poblacion: 5620285,
    superficie: 7723,
    comunidad: 'Cataluña',
    bounds: [[41.3, 2.0], [41.5, 2.3]]
  },
  {
    codigo: '46',
    nombre: 'Valencia',
    capital: 'Valencia',
    poblacion: 2550000,
    superficie: 10762,
    comunidad: 'Comunidad Valenciana',
    bounds: [[39.4, -0.4], [39.5, -0.3]]
  },
  {
    codigo: '41',
    nombre: 'Sevilla',
    capital: 'Sevilla',
    poblacion: 1940000,
    superficie: 14036,
    comunidad: 'Andalucía',
    bounds: [[37.2, -6.2], [37.6, -5.8]]
  },
  {
    codigo: '50',
    nombre: 'Zaragoza',
    capital: 'Zaragoza',
    poblacion: 973000,
    superficie: 17274,
    comunidad: 'Aragón',
    bounds: [[41.5, -1.2], [42.0, -0.7]]
  },
  {
    codigo: '03',
    nombre: 'Alicante',
    capital: 'Alicante',
    poblacion: 1850000,
    superficie: 5817,
    comunidad: 'Comunidad Valenciana',
    bounds: [[38.2, -0.9], [38.8, -0.1]]
  },
  {
    codigo: '29',
    nombre: 'Málaga',
    capital: 'Málaga',
    poblacion: 1680000,
    superficie: 7308,
    comunidad: 'Andalucía',
    bounds: [[36.6, -4.6], [36.9, -4.3]]
  },
  {
    codigo: '48',
    nombre: 'Vizcaya',
    capital: 'Bilbao',
    poblacion: 1150000,
    superficie: 2217,
    comunidad: 'País Vasco',
    bounds: [[43.1, -3.1], [43.4, -2.8]]
  },
  {
    codigo: '26',
    nombre: 'La Rioja',
    capital: 'Logroño',
    poblacion: 316000,
    superficie: 5045,
    comunidad: 'La Rioja',
    bounds: [[42.2, -2.6], [42.5, -2.3]]
  },
  {
    codigo: '33',
    nombre: 'Asturias',
    capital: 'Oviedo',
    poblacion: 1020000,
    superficie: 10564,
    comunidad: 'Asturias',
    bounds: [[43.2, -6.1], [43.6, -5.5]]
  },
  {
    codigo: '35',
    nombre: 'Las Palmas',
    capital: 'Las Palmas de Gran Canaria',
    poblacion: 1110000,
    superficie: 4066,
    comunidad: 'Canarias',
    bounds: [[27.8, -15.8], [29.3, -13.3]]
  },
  {
    codigo: '38',
    nombre: 'Santa Cruz de Tenerife',
    capital: 'Santa Cruz de Tenerife',
    poblacion: 1030000,
    superficie: 3381,
    comunidad: 'Canarias',
    bounds: [[28.0, -17.9], [28.5, -16.1]]
  },
  {
    codigo: '15',
    nombre: 'A Coruña',
    capital: 'A Coruña',
    poblacion: 1120000,
    superficie: 7950,
    comunidad: 'Galicia',
    bounds: [[42.8, -9.0], [43.8, -7.8]]
  },
  {
    codigo: '27',
    nombre: 'Lugo',
    capital: 'Lugo',
    poblacion: 326000,
    superficie: 9856,
    comunidad: 'Galicia',
    bounds: [[42.5, -7.8], [43.8, -6.8]]
  },
  {
    codigo: '32',
    nombre: 'Ourense',
    capital: 'Ourense',
    poblacion: 305000,
    superficie: 7273,
    comunidad: 'Galicia',
    bounds: [[41.8, -8.2], [42.5, -7.0]]
  },
  {
    codigo: '36',
    nombre: 'Pontevedra',
    capital: 'Pontevedra',
    poblacion: 942000,
    superficie: 4495,
    comunidad: 'Galicia',
    bounds: [[41.8, -9.0], [42.8, -8.2]]
  },
  {
    codigo: '07',
    nombre: 'Baleares',
    capital: 'Palma',
    poblacion: 1170000,
    superficie: 4992,
    comunidad: 'Islas Baleares',
    bounds: [[38.5, 1.2], [40.0, 4.3]]
  },
  {
    codigo: '37',
    nombre: 'Salamanca',
    capital: 'Salamanca',
    poblacion: 330000,
    superficie: 12349,
    comunidad: 'Castilla y León',
    bounds: [[40.5, -6.8], [41.2, -5.5]]
  },
  {
    codigo: '47',
    nombre: 'Valladolid',
    capital: 'Valladolid',
    poblacion: 520000,
    superficie: 8110,
    comunidad: 'Castilla y León',
    bounds: [[41.3, -5.2], [42.0, -4.3]]
  },
  {
    codigo: '49',
    nombre: 'Zamora',
    capital: 'Zamora',
    poblacion: 170000,
    superficie: 10559,
    comunidad: 'Castilla y León',
    bounds: [[41.2, -6.8], [42.2, -5.5]]
  }
]; 