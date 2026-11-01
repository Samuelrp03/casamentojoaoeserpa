"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { GiftStep } from "@/components/gift-step";

type ResponseValue = "accept" | "decline";

type Step = "info" | "gifts" | "done";

interface FormValues {
  name: string;
  response: ResponseValue | null;
  message: string;
}

interface FormErrors {
  name?: string;
  response?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ChosenGift = {
  id: number;
  name: string;
};

const RESPONSE_OPTIONS: { value: ResponseValue; label: string }[] = [
  { value: "accept", label: "Aceito com alegria" },
  { value: "decline", label: "Declino com pesar" },
];

async function submitRsvp(values: FormValues): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        response: values.response,
        message: values.message,
      }),
    });

    const data = await response.json();
    return data as { ok: boolean; error?: string };
  } catch (error) {
    console.error("Erro ao enviar RSVP:", error);
    return { ok: false, error: "Erro ao enviar confirmação." };
  }
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function RsvpForm() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    response: null,
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [step, setStep] = useState<Step>("info");
  const [submittedName, setSubmittedName] = useState("");
  const [chosenGift, setChosenGift] = useState<ChosenGift | null>(null);

  const nameId = useId();
  const responseGroupId = useId();
  const messageId = useId();
  const nameErrorId = useId();
  const responseErrorId = useId();
  const statusId = useId();
  const giftsTitleId = useId();
  const doneTitleId = useId();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === "gifts") {
      stepHeadingRef.current?.focus();
    } else if (step === "done") {
      doneRef.current?.focus();
    }
  }, [step]);

  function validate(formValues: FormValues): FormErrors {
    const nextErrors: FormErrors = {};
    if (!formValues.name.trim()) {
      nextErrors.name = "Por favor, informe seu nome.";
    }
    if (!formValues.response) {
      nextErrors.response = "Por favor, escolha uma resposta ao convite.";
    }
    return nextErrors;
  }

  function clearError(field: keyof FormErrors) {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || step !== "info") return;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      if (validationErrors.name) {
        nameInputRef.current?.focus();
      } else {
        firstRadioRef.current?.focus();
      }
      return;
    }

    setStatus("submitting");
    try {
      const result = await submitRsvp(values);
      if (result.ok) {
        setStatus("success");
        setSubmittedName(values.name.trim());
        setStep(values.response === "accept" ? "gifts" : "done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setValues((previous) => ({ ...previous, name: event.target.value }));
    clearError("name");
  }

  function handleResponseChange(value: ResponseValue) {
    setValues((previous) => ({ ...previous, response: value }));
    clearError("response");
  }

  function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValues((previous) => ({ ...previous, message: event.target.value }));
  }

  function handleGiftStepFinish(gift: ChosenGift | null) {
    setChosenGift(gift);
    setStep("done");
  }

  const isSubmitting = status === "submitting";
  const activeStep = step === "info" ? 0 : values.response === "accept" ? 1 : 0;
  const isInfoDone = step !== "info";
  const isGiftsDone = step === "done" && values.response === "accept";

  return (
    <form
      data-anim="rsvp-card"
      className="rounded-2xl px-6 py-6 sm:px-6 sm:py-8 bg-cream/95 backdrop-blur-sm shadow-sm lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={
        step === "info"
          ? `${responseGroupId}-title`
          : step === "gifts"
            ? giftsTitleId
            : doneTitleId
      }
    >
      <div className="lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <ol
        className="mb-5 flex shrink-0 items-center justify-center gap-2 sm:gap-3 lg:mb-2"
        aria-label="Etapas do formulário"
      >
        <li className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-2">
            <span
              aria-current={activeStep === 0 ? "step" : undefined}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                isInfoDone
                  ? "border-ocean bg-ocean/10 text-ocean"
                  : activeStep === 0
                    ? "border-ocean bg-ocean text-cream"
                    : "border-beige bg-cream text-ink-soft"
              }`}
            >
              {isInfoDone ? <CheckIcon /> : 1}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm ${
                activeStep === 0 ? "text-ocean" : "text-ink"
              }`}
            >
              Informações
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2 sm:gap-3">
          <span
            aria-hidden="true"
            className={`h-px w-5 sm:w-8 ${
              isInfoDone ? "bg-ocean/50" : "bg-beige"
            }`}
          />
          <span className="inline-flex items-center gap-2">
            <span
              aria-current={activeStep === 1 ? "step" : undefined}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                isGiftsDone
                  ? "border-ocean bg-ocean/10 text-ocean"
                  : activeStep === 1
                    ? "border-ocean bg-ocean text-cream"
                    : "border-beige bg-cream text-ink-soft"
              }`}
            >
              {isGiftsDone ? <CheckIcon /> : 2}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm ${
                activeStep === 1
                  ? "text-ocean"
                  : isGiftsDone
                    ? "text-ink"
                    : "text-ink-soft"
              }`}
            >
              Presentes
            </span>
          </span>
        </li>
      </ol>

      <p role="status" aria-live="polite" className="sr-only">
        {step === "info"
          ? "Etapa 1 de 2: informações"
          : step === "gifts"
            ? "Etapa 2 de 2: presentes"
            : "Formulário concluído"}
      </p>

      {step === "info" && (
        <div className="lg:my-auto">
          <h3
            id={`${responseGroupId}-title`}
            className="text-center font-display text-[clamp(1.6rem,4.5vw,2.25rem)] leading-tight lg:text-2xl xl:text-3xl"
          >
            <span className="text-ocean">Confirme sua </span>
            <span className="text-orange">Presença</span>
          </h3>

          <div className="mt-6 space-y-5 lg:mt-4 lg:space-y-3">
            <div data-anim="rsvp-field">
              <label htmlFor={nameId} className="block text-sm font-semibold text-ink">
                Nome
              </label>
              <input
                ref={nameInputRef}
                id={nameId}
                name="name"
                type="text"
                required
                autoComplete="name"
                value={values.name}
                onChange={handleNameChange}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? nameErrorId : undefined}
                className="mt-2 w-full rounded-lg border border-beige bg-cream-deep px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ocean focus:bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 min-h-11 lg:py-2"
                placeholder="Como devemos chamar você?"
              />
              {errors.name ? (
                <p id={nameErrorId} role="alert" className="mt-2 text-sm text-orange">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <fieldset data-anim="rsvp-field" className="space-y-3 lg:space-y-2">
              <legend className="text-sm font-semibold text-ink">
                Você aceita o convite?
              </legend>
              {errors.response ? (
                <p id={responseErrorId} role="alert" className="text-sm text-orange">
                  {errors.response}
                </p>
              ) : null}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {RESPONSE_OPTIONS.map((option, index) => {
                  const optionId = `${responseGroupId}-${option.value}`;
                  const isChecked = values.response === option.value;
                  return (
                    <label
                      key={option.value}
                      htmlFor={optionId}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors lg:px-3 lg:py-2 ${
                        isChecked
                          ? "border-ocean bg-ocean/10"
                          : "border-beige bg-cream hover:border-ocean/60"
                      } ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
                    >
                      <input
                        ref={index === 0 ? firstRadioRef : undefined}
                        id={optionId}
                        type="radio"
                        name="rsvp-response"
                        value={option.value}
                        checked={isChecked}
                        onChange={() => handleResponseChange(option.value)}
                        disabled={isSubmitting}
                        className="h-5 w-5 accent-ocean focus-visible:outline-none"
                      />
                      <span className="text-ink">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div data-anim="rsvp-field">
              <label htmlFor={messageId} className="block text-sm font-semibold text-ink">
                Deseja deixar uma mensagem para o casal?
              </label>
              <textarea
                id={messageId}
                name="message"
                rows={4}
                maxLength={256}
                value={values.message}
                onChange={handleMessageChange}
                disabled={isSubmitting}
                className="mt-2 w-full resize-y rounded-lg border border-beige bg-cream px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ocean focus:bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 lg:h-20 lg:py-2"
                placeholder="Escreva aqui sua mensagem (opcional)."
              />
              <p className="mt-1 text-right text-xs text-ink-soft">
                {values.message.length}/256
              </p>
            </div>
          </div>

          <div data-anim="rsvp-field" className="mt-6 lg:mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              data-status={status}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-cream transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed ${
                status === "error"
                  ? "bg-orange hover:bg-orange/90 focus-visible:ring-orange"
                  : "bg-ocean hover:bg-ink hover:scale-[1.01] active:scale-[0.995] focus-visible:ring-ocean"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
                  />
                  Enviando...
                </>
              ) : status === "error" ? (
                "Tentar novamente"
              ) : (
                "Enviar resposta"
              )}
            </button>
          </div>

          <div
            id={statusId}
            role="status"
            aria-live="polite"
            className="mt-2 min-h-[1rem]"
          >
            {status === "error" ? (
              <p role="alert" className="text-center text-sm text-orange">
                Não foi possível processar sua resposta. Verifique os campos e tente novamente.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {step === "gifts" && (
        <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col mb-12">
          <h3
            id={giftsTitleId}
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-center font-display text-[clamp(1.6rem,4.5vw,2.25rem)] leading-tight focus-visible:outline-none lg:shrink-0"
          >
            <span className="text-ocean">Escolha um </span>
            <span className="text-orange">Presente</span>
          </h3>
          <div className="mt-4 lg:flex lg:min-h-0 lg:flex-1">
            <GiftStep guestName={submittedName} onFinish={handleGiftStepFinish} />
          </div>
        </div>
      )}

      {step === "done" && (
        <div
          ref={doneRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-3 rounded-xl border border-ocean/30 bg-ocean/5 px-4 py-8 text-center focus-visible:outline-none lg:my-auto"
        >
          <h3
            id={doneTitleId}
            className="font-display text-xl text-ink sm:text-2xl"
          >
            Resposta enviada!
          </h3>
          <p className="text-sm text-ink-soft sm:text-base">
            {values.response === "accept" ? (
              <>
                <strong className="text-ink">{submittedName}</strong>, que alegria
                ter você com a gente.
              </>
            ) : (
              <>
                <strong className="text-ink">{submittedName}</strong>, sentiremos
                sua falta.
              </>
            )}
          </p>
          {chosenGift && (
            <p className="rounded-lg border border-ocean/30 bg-cream/80 px-4 py-2 text-sm text-ink">
              Presente escolhido:{" "}
              <strong className="text-ocean">{chosenGift.name}</strong>
            </p>
          )}
          <p className="text-xs text-ink-soft">
            Obrigado pelo carinho com os noivos.
          </p>
        </div>
      )}
      </div>
    </form>
  );
}
