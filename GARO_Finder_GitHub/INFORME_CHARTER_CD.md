# Informe GARO — Fórmula de contribución Charter (C/D)
**Airline Manager 4 · Easy · GARO-AIRLINE**  
**Periodo de medición:** octubre–noviembre 2026  
**Aeronave de prueba:** A340-300 · rutas ~5.500–6.000 km · CI ~55–58 · pax ≫ 14

---

## 1. Objetivo

Determinar cómo el juego acredita **contribución de alianza (C/D)** en vuelos **charter**, frente a la fórmula “papel” de Cathay para pax, y obtener un modelo usable en el Route Finder.

---

## 2. Procedimiento experimental

### 2.1 Condiciones controladas
- Flota pax/carga en tierra cuando se midió solo charter (salvo el cierre del 10.º ciclo).
- Marketing / reputación **no** se usó como variable de C/D (pruebas a ~44 %; el mito del 34 % no aumentó puntos).
- Mínimo de pasajeros: vuelo vacío = **0** puntos; hace falta carga mínima (~14 pax).
- Solo suma el **despegue**; el aterrizaje no acredita.
- El panel de alianza puede repartir el mismo lote en **2–3 oleadas** (lag ~5–20 min): se suma el total hasta meseta.

### 2.2 Series realizadas
1. N=1 (avión de prueba A340) en la misma ruta que un charter.
2. Bloques **N=5** (dos grupos) — 1.º y 2.º ciclo.
3. Bloque **N=10** desde C/D ≈ 0 — 1.º despegue.
4. Bloque **N=10** programa **2 ciclos** — 2.º despegue.
5. Bloque **N=10** programa **10 ciclos** — ciclos 1 al 10 completos, con lecturas antes/después y meseta.

### 2.3 Registro típico por ciclo
```
hora + C/D base (flota charter solo)
despegue del lote
lecturas cada pocos minutos hasta meseta (15–20 min)
Δ = meseta − base
Δ/avión = Δ / N
```

---

## 3. Resultados principales

### 3.1 Primer despegue del programa (cualquier N medido)
| Setup | Δ / avión |
|-------|-----------|
| N=1, 5, 10 | **~37–45** (típicamente **~45**) |

No hay “bono de grupo” en el **1.er** despegue: N=10 desde 0 → **+447** ≈ **44,7/avión**.

### 3.2 Segundo despegue y siguientes
| Setup | Δ / avión |
|-------|-----------|
| N≈5, ciclo 2 | **~110–125** (media ~115) |
| N=10, ciclo 2 | **~220–240** |
| N=10, ciclos **2 a 10** | **~220** estable (**Δ lote ≈ +2.195 / +2.196**) |

Serie N=10 × 10 ciclos (resumen):

| Ciclo | Δ lote | Δ / avión |
|-------|--------|-----------|
| 1 | ~369 | ~37–45 |
| 2–10 | ~2195–2196 | **~220** |

### 3.3 Otros hechos confirmados
- Retirar el vuelo puede anular el crédito de ese despegue.
- Marketing 100 % o 34 % **no** explica el salto de C/D; sirve sobre todo a **demanda / ocupación**.
- Demanda charter: pool **semanal** (Y/J); pax/carga: pool **diario**.
- Coherencia con “papel” Cathay en el 1.er ciclo:  
  \(C_1 \approx 0{,}49 \times C_{\text{papel}}\) (~45 vs ~90–93 a 6.000 km, CI~55).

---

## 4. Fórmula operativa GARO (Easy, ~5.500–6.000 km)

Sea:
- \(N\) = aviones del **mismo lote** lanzados juntos (1–20; el cliente permite hasta 20).
- \(k\) = índice de despegue dentro del **programa** charter (1 = primero, 2 = segundo, …).
- \(C_k(N)\) = contribución **por avión** en el despegue \(k\).

\[
C_k(N) =
\begin{cases}
45 & \text{si } k = 1 \\[4pt]
220 & \text{si } k \ge 2 \text{ y } N \ge 10 \\[4pt]
115 & \text{si } k \ge 2 \text{ y } 5 \le N < 10 \\[4pt]
\approx 50 & \text{si } k \ge 2 \text{ y } N < 5 \text{ (pocos datos)}
\end{cases}
\]

**Programa completo** (por avión), \(M\) ciclos:

\[
C_{\text{semana/avión}}(N,M) = C_1(N) + \sum_{k=2}^{M} C_k(N)
\]

Con **N ≥ 10**:

\[
C_{\text{semana/avión}}(10,M) \approx 45 + 220\,(M-1)
\]

Ejemplos:
- 10 ciclos, N=10 → \(45 + 220\times 9 = 2025\) / avión en el programa.
- 2 ciclos, N=10 → \(45 + 220 = 265\) / avión.

**Lote de 10 en un despegue \(k\ge 2\):**  
\(\Delta_{\text{alianza}} \approx 10 \times 220 = 2200\) (medido ~2195).

---



---

## 4.bis Fórmula en modo **Realism**

La base numérica se midió en Easy. En Realism se aplica el mismo factor de modo que Cathay:

\[
k_{gm} =
\begin{cases}
1.0 & \text{Easy} \\
1.5 & \text{Realism}
\end{cases}
\]

\[
C_k^{\mathrm{R}}(N) = k_{gm}\, C_k^{\mathrm{Easy}}(N)
\]

Por tanto, **Realism**:

\[
C_k(N) =
\begin{cases}
67{,}5 & k = 1 \\
330 & k \ge 2,\ N \ge 10 \\
172{,}5 & k \ge 2,\ 5 \le N < 10 \\
75 & k \ge 2,\ N < 5
\end{cases}
\]

Programa \(M\) ciclos, \(N \ge 10\), Realism:

\[
C_{\mathrm{semana/avión}} \approx 67{,}5 + 330\,(M-1)
\]

Ejemplos Realism N=10:
- 2 ciclos → \(67{,}5 + 330 = 397{,}5\) / avión
- 10 ciclos → \(67{,}5 + 330\times 9 = 3037{,}5\) / avión

*Pendiente de validación con una serie N=10 en Realism; hasta entonces se usa k_gm = 1,5 por coherencia con el modo del juego.*


## 5. Relación con Cathay (pax “papel”)

\[
C_{\text{papel}} = \min\bigl(k_{gm}\cdot k(d)\cdot d\cdot(3-\mathrm{CI}/100),\,152\bigr)
\]

Easy, \(d<6000\): \(k_{gm}=1\), \(k(d)=0{,}0064\).

En la banda medida, \(C_{\text{papel}}\sim 90{-}93\). El 1.er ciclo charter ≈ **media** de ese valor; a partir del 2.º, con N=10, el juego paga **~2,4 × papel** de forma estable — **no** se modela bien solo con Cathay sin el factor de ciclo y de lote.

---

## 6. Límites del modelo

- Calibrado en **Easy**, long-haul corto (**~5,5–6k km**), A340-300.
- **Realism** y otras distancias: no extrapolado con la misma constante.
- N=15 / N=20: hipótesis abierta (posible otro escalón; no medido).
- Ventana móvil ~24 h de la alianza: los totales de pantalla mezclan entradas y caducidades; por eso se usa **Δ entre mesetas** con poco tráfico ajeno.
- No se afirma bono por “cerrar ida-vuelta” distinto del índice de ciclo del programa.

---

## 7. Uso en el Route Finder

```
C/D por ciclo ≈ C_k(N)
C/D semana / avión ≈ 45 + 220*(ciclos-1)   // N>=10
```

Marketing % en el finder escala demanda visible (ocupación), **no** el C/D.

---

## 8. Conclusión

La contribución charter **no** es la misma serie que un pax suelto en todos los despegues: el **primer** ciclo del programa se comporta cerca del régimen “normal” (~45); **desde el segundo**, en lotes grandes (N=10), el juego acredita de forma **repetible ~220 puntos por avión y despegue**. Eso se midió de forma consistente en **nueve** ciclos consecutivos (2–10) con el mismo Δ de lote (~2195).

*Documento GARO-AIRLINE · investigación C/D charter · 2026-11-02*
