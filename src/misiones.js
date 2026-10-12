// ============================================================================
//  MISIONES — Sistema de Pedidos y Clientes · Informática III (Grupo 1301)
// ============================================================================
//  Este es el ÚNICO archivo de lógica que vas a modificar.
//
//  Cada función está "vacía" a propósito. Tu sitio publicado en Vercel tiene un
//  panel de verificación que corre casos de prueba contra estas funciones y te
//  dice cuál falla, qué esperaba y qué obtuvo. Lee el caso que falla ANTES de
//  cambiar código: así se trabaja con pruebas unitarias (lo verás en 3.4).
//
//  Puedes verificar sin publicar con:  npm run verificar
//
//  Orden recomendado: 1 → 2 → 3 → 4 → 5. La 6 es para Destacado.
// ============================================================================

import { ESTADOS } from './datos.js'

/// ----------------------------------------------------------------------------
// MISIÓN 1 · RF3 — ¿Cuánto paga el cliente?
// ----------------------------------------------------------------------------
export function totalPedido(pedido) {
  if (!pedido.items || pedido.items.length === 0) return 0;
  
  let subtotal = 0;
  for (let i = 0; i < pedido.items.length; i++) {
    subtotal += pedido.items[i].cantidad * pedido.items[i].precioUnitario;
  }
  
  const descuento = pedido.descuento || 0;
  const total = subtotal * (1 - descuento);
  return Math.round(total * 100) / 100;
}
// ----------------------------------------------------------------------------
// MISIÓN 2 · RF4 — ¿Este cambio de estado es válido?
// ----------------------------------------------------------------------------
export function puedeTransicionar(actual, nuevo) {
  const iActual = ESTADOS.indexOf(actual);
  const iNuevo = ESTADOS.indexOf(nuevo);
  
  // Debe existir en el arreglo y ser exactamente el siguiente (índice + 1)
  return iActual !== -1 && iNuevo !== -1 && iNuevo === iActual + 1;
}
// ----------------------------------------------------------------------------
// MISIÓN 3 · RF1 — ¿Los datos del cliente son válidos?
// ----------------------------------------------------------------------------
export function validarCliente(cliente) {
  const errores = [];
  
  // Nombre vacío o solo espaciosgit
  if (!cliente.nombre || cliente.nombre.trim() === '') {
    errores.push('nombre_requerido');
  }
  
  // Teléfono: quitar espacios y guiones, verificar 10 dígitos exactos
  const tel = (cliente.telefono || '').replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(tel)) {
    errores.push('telefono_invalido');
  }
  
  // Email: si viene, validar formato básico algo@algo.algo
  if (cliente.email && cliente.email.trim() !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      errores.push('email_invalido');
    }
  }
  
  return errores;
}
// ----------------------------------------------------------------------------
// MISIÓN 4 · RF5 — ¿Cuántos pedidos hay en cada estado?
// ----------------------------------------------------------------------------
export function resumenPorEstado(pedidos) {
  const resumen = {};
  for (let i = 0; i < ESTADOS.length; i++) {
    resumen[ESTADOS[i]] = 0;
  }
  
  if (Array.isArray(pedidos)) {
    for (let i = 0; i < pedidos.length; i++) {
      const estado = pedidos[i].estado;
      if (resumen[estado] !== undefined) {
        resumen[estado]++;
      }
    }
  }
  
  return resumen;
}
// ----------------------------------------------------------------------------
// MISIÓN 5 · RF5 — Buscar pedidos por nombre de cliente
// ----------------------------------------------------------------------------
export function buscarPedidos(pedidos, texto) {
  if (!Array.isArray(pedidos)) return [];
  
  const busqueda = (texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  if (busqueda === '') return pedidos;
  
  const resultado = [];
  for (let i = 0; i < pedidos.length; i++) {
    const nombre = (pedidos[i].cliente && pedidos[i].cliente.nombre ? pedidos[i].cliente.nombre : '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
      
    if (nombre.includes(busqueda)) {
      resultado.push(pedidos[i]);
    }
  }
  
  return resultado;
}
// ----------------------------------------------------------------------------
// MISIÓN 6 · DESTACADO — Los mejores clientes
// ----------------------------------------------------------------------------

export function topClientes(pedidos, n) {
  if (!Array.isArray(pedidos)) return [];
  
  const acumulado = {};
  
  for (let i = 0; i < pedidos.length; i++) {
    const nombre = pedidos[i].cliente && pedidos[i].cliente.nombre ? pedidos[i].cliente.nombre : 'Desconocido';
    const gasto = totalPedido(pedidos[i]);
    
    if (!acumulado[nombre]) {
      acumulado[nombre] = 0;
    }
    acumulado[nombre] += gasto;
  }
  
  const lista = [];
  const nombres = Object.keys(acumulado);
  for (let i = 0; i < nombres.length; i++) {
    lista.push({
      cliente: nombres[i],
      total: Math.round(acumulado[nombres[i]] * 100) / 100
    });
  }
  lista.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    return a.cliente.localeCompare(b.cliente);
  });
  
  return lista.slice(0, n);
}