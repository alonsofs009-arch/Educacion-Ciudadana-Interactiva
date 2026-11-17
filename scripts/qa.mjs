import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { articles } from "../src/data/articles.js";
import { examBlueprint, examQuestions, calculateGrade } from "../src/data/exam.js";
import { lessons } from "../src/data/lessons.js";

const baseUrl = process.env.QA_URL || "http://127.0.0.1:5173";
const evidenceDir = new URL("../evidence/", import.meta.url);
await fs.mkdir(evidenceDir, { recursive: true });
const evidenceFile = (name) => fileURLToPath(new URL(name, evidenceDir));

assert.equal(lessons.length, 17, "Debe haber 17 lecciones");
assert.equal(articles.length, 30, "El atlas debe incluir los 30 artículos");
assert.equal(examQuestions.length, 40, "La prueba debe tener 40 preguntas");
assert.deepEqual(examBlueprint.map((unit) => unit.count), [16, 16, 8]);
assert.equal(examQuestions.filter((q) => q.type === "mc").length, 24);
assert.equal(examQuestions.filter((q) => q.type === "case").length, 8);
assert.equal(examQuestions.filter((q) => q.type === "vf").length, 4);
assert.equal(examQuestions.filter((q) => q.type === "develop").length, 4);
assert.deepEqual([0, 1, 2, 3].map((answer) => examQuestions.filter((q) => q.options && q.answer === answer).length), [8, 8, 8, 8], "Las 32 alternativas deben repartir la posición correcta de manera equilibrada");
for (const lesson of lessons) {
  assert.equal(lesson.activities.length, 2, `Lección ${lesson.id} debe incluir dos actividades breves`);
  assert.ok(lesson.visual, `Lección ${lesson.id} debe incluir un visual`);
}
assert.deepEqual([calculateGrade(0), calculateGrade(33), calculateGrade(34), calculateGrade(56)], [1, 3.9, 4, 7]);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.screenshot({ path: evidenceFile("inicio-1920x1080.png") });
  const firstHeading = await page.locator("h1").first().innerText();
  assert.match(firstHeading, /Derechos Humanos/);

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ path: evidenceFile("inicio-1366x768.png") });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflow, false, "La pantalla inicial no debe desbordarse horizontalmente a 1366 px");

  for (const viewport of [
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `Sin desborde horizontal a ${viewport.width}px`);
    await page.screenshot({ path: evidenceFile(`inicio-${viewport.name}.png`) });
    await page.locator(".mobile-menu").click();
    await page.locator(".sidebar.sidebar-open").waitFor();
    await page.locator(".sidebar-close").click();
    await page.locator(".sidebar.sidebar-open").waitFor({ state: "detached" });
    await page.waitForTimeout(300);
  }
  await page.setViewportSize({ width: 1366, height: 768 });

  await page.getByRole("button", { name: /5\. Atlas interactivo/ }).click();
  const article30 = page.getByRole("button", { name: /^Artículo 30:/ });
  await article30.click();
  await page.getByText("ARTÍCULO 30", { exact: true }).waitFor();
  assert.match(await page.locator(".article-inspector").innerText(), /Artículo 30/i);
  await page.screenshot({ path: evidenceFile("atlas-articulo-30.png") });

  const lessonFive = lessons.find((lesson) => lesson.id === 5);
  const choiceIndex = lessonFive.activities.findIndex((activity) => Array.isArray(activity.options));
  const choiceActivity = page.locator(".activity-card").nth(choiceIndex);
  await choiceActivity.locator(".answer-option").nth(lessonFive.activities[choiceIndex].answer).click();
  await choiceActivity.getByRole("button", { name: /Comprobar respuesta/ }).click();
  await choiceActivity.locator(".feedback-good").waitFor();

  await page.getByRole("button", { name: "Marcar como aprendida" }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("educacion-ciudadana-progreso-v1") || "{}").completedLessons?.includes(5));
  assert.ok((await page.evaluate(() => localStorage.getItem("educacion-ciudadana-progreso-v1"))).includes('"completedLessons":[5]'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "La lección debe adaptarse a móvil sin desborde horizontal");
  await page.locator(".page-scroll").evaluate((element) => element.scrollTo(0, 0));
  await page.screenshot({ path: evidenceFile("leccion-05-mobile.png") });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Glosario cívico" }).click();
  await page.getByRole("dialog", { name: "Glosario cívico" }).waitFor();
  await page.getByPlaceholder(/autonomía, querella/).fill("presunción de inocencia");
  assert.ok(await page.locator(".glossary-list button").count());
  await page.getByRole("button", { name: "Cerrar" }).click();
  await page.keyboard.press("Control+k");
  await page.getByRole("dialog", { name: "Buscar en el curso" }).waitFor();
  await page.getByPlaceholder(/institución, derecho/).fill("formalización");
  assert.ok(await page.locator(".search-result-list button").count());
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Ruta 120 min/ }).click();
  await page.getByRole("heading", { name: /Tu recorrido de 120 minutos/ }).waitFor();
  await page.getByRole("button", { name: "Cerrar" }).click();
  await page.getByRole("button", { name: "REPASAR" }).click();
  await page.getByRole("heading", { name: /Recupera antes de mirar/ }).waitFor();
  await page.getByRole("button", { name: "EVALUARME" }).click();
  await page.getByRole("button", { name: /Comenzar prueba/ }).click();
  await page.getByText("PREGUNTA 01", { exact: false }).waitFor();

  const first = examQuestions[0];
  await page.locator(".exam-options button").nth(first.answer).click();
  await page.getByRole("button", { name: "Pregunta 40" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("PREGUNTA 40", { exact: false }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "La evaluación debe adaptarse a móvil sin desborde horizontal");
  await page.screenshot({ path: evidenceFile("evaluacion-mobile.png") });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Pregunta 1", exact: true }).click();
  assert.equal(await page.locator(".exam-options button.selected").count(), 1, "La respuesta del borrador debe persistir al recargar");

  for (let index = 0; index < examQuestions.length; index += 1) {
    const question = examQuestions[index];
    await page.locator(".exam-question-nav button").nth(index).click();
    if (question.type === "mc" || question.type === "case") {
      await page.locator(".exam-options button").nth(question.answer).click();
    } else if (question.type === "vf") {
      await page.getByRole("button", { name: question.answer ? "Verdadero" : "Falso" }).click();
      await page.locator("#vf-reason").fill(question.explanation);
    } else {
      await page.locator(".exam-development textarea").fill(question.model);
    }
  }
  await page.getByRole("button", { name: /Finalizar y corregir/ }).click();
  await page.getByRole("heading", { name: "Tu resultado semestral" }).waitFor();
  for (const rubric of await page.locator("details.result-rubric").all()) {
    await rubric.locator("summary").click();
    const criteria = rubric.locator(".rubric-criteria button");
    for (let index = 0; index < await criteria.count(); index += 1) await criteria.nth(index).click();
    const rationale = rubric.locator(".rationale-rating button", { hasText: "Sí, 1 punto" });
    if (await rationale.count()) await rationale.click();
  }
  assert.match(await page.locator(".result-score").innerText(), /56\s*\/\s*56[\s\S]*7\.0/);
  await page.locator(".page-scroll").evaluate((element) => element.scrollTo(0, 0));
  await page.screenshot({ path: evidenceFile("resultado-1366x768.png") });

  const photoResults = [];
  for (const lesson of lessons) {
    const lessonId = lesson.id;
    console.log(`Visual QA: lección ${lessonId}`);
    await page.getByRole("button", { name: new RegExp(`^${lessonId}\\. `) }).click();
    await page.locator(".lesson-visual").waitFor();
    await page.locator("img").evaluateAll((images) => images.forEach((image) => { image.loading = "eager"; image.scrollIntoView({ block: "center" }); }));
    await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => image.decode().catch(() => null))));
    photoResults.push(...await page.locator("img").evaluateAll((images) => images.map((image) => ({ src: image.getAttribute("src"), loaded: image.complete && image.naturalWidth > 0 }))));
    assert.equal(await page.locator("h1").innerText(), lesson.title);
    if (lessonId === 11) {
      await page.getByRole("button", { name: "Seleccionar Fiscalía" }).click();
      assert.match(await page.locator(".courtroom-person").innerText(), /Fiscalía/);
    }
    if (lessonId === 15) {
      await page.getByRole("button", { name: "Los Lagos · provincias" }).click();
      await page.getByRole("button", { name: "Provincia de Llanquihue", exact: true }).click();
      assert.match(await page.locator(".province-legend button.active").innerText(), /Llanquihue/);
    }
    if (lessonId === 16) {
      await page.getByRole("button", { name: "Alcalde y concejo municipal" }).click();
      assert.match(await page.locator(".authority-inspector").innerText(), /municipal/i);
    }
  }
  const uniquePhotos = [...new Map(photoResults.map((photo) => [photo.src, photo])).values()];
  assert.ok(uniquePhotos.length >= 6, `Se esperaban al menos seis fotografías relevantes, se vieron ${uniquePhotos.length}`);
  assert.ok(uniquePhotos.every((image) => image.loaded), "Todas las fotografías locales deben cargar");
  assert.deepEqual(pageErrors, [], `Errores de ejecución: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `Errores de consola: ${consoleErrors.join(" | ")}`);
  await page.getByLabel("Fuentes y créditos").click();
  const creditHref = await page.locator(".credits-link").getAttribute("href");
  assert.ok(creditHref?.includes("CREDITOS.md"), "El enlace de atribuciones debe seguir la base de Vite");
  const creditsResponse = await page.request.get(new URL(creditHref, baseUrl).toString());
  assert.equal(creditsResponse.status(), 200, "La ficha local de créditos debe estar disponible");
  const faviconHref = await page.locator('link[rel="icon"]').getAttribute("href");
  assert.ok(faviconHref?.endsWith("favicon.svg"), "El favicon debe usar el prefijo base de Vite");
  const faviconResponse = await page.request.get(new URL(faviconHref, baseUrl).toString());
  assert.equal(faviconResponse.status(), 200, "El favicon debe cargar en producción");
  console.log(JSON.stringify({ status: "OK", firstHeading, lessonsVisited: lessons.length, photosLoaded: uniquePhotos.length, responsiveViewports: ["1920x1080", "1366x768", "768x1024", "390x844"], gradeChecks: [0, 33, 34, 56], screenshots: ["inicio-1920x1080.png", "inicio-1366x768.png", "inicio-tablet.png", "inicio-mobile.png", "leccion-05-mobile.png", "evaluacion-mobile.png", "atlas-articulo-30.png", "resultado-1366x768.png"] }, null, 2));
} finally {
  await browser.close();
}
