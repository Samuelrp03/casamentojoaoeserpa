"use client";

import { useRef, useState, useId } from "react";
import type { FormEvent, ChangeEvent } from "react";

type ResponseValue = "accept" | "decline";

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

export function RsvpForm() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    response: null,
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const nameId = useId();
  const responseGroupId = useId();
  const messageId = useId();
  const nameErrorId = useId();
  const responseErrorId = useId();
  const statusId = useId();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);

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
    if (status === "submitting") return;

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

  const isSubmitting = status === "submitting";

  return (
    <form
      data-anim="rsvp-card"
      className="rounded-2xl px-6 py-6 sm:px-6 sm:py-8 lg:px-3 lg:py-10 bg-cream/95 backdrop-blur-sm shadow-sm lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${responseGroupId}-title`}
    >
      <h3
        id={`${responseGroupId}-title`}
        className="text-center font-display text-[clamp(1.6rem,4.5vw,2.25rem)] leading-tight"
      >
        <span className="text-ocean">Confirme sua </span>
        <span className="text-orange">Presença</span>
      </h3>

      <div className="mt-6 space-y-5">
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
            className="mt-2 w-full rounded-lg border border-beige bg-cream-deep px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ocean focus:bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 min-h-11"
            placeholder="Como devemos chamar você?"
          />
          {errors.name ? (
            <p
              id={nameErrorId}
              role="alert"
              className="mt-2 text-sm text-orange"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <fieldset data-anim="rsvp-field" className="space-y-3">
          <legend className="text-sm font-semibold text-ink">
            Você aceita o convite?
          </legend>
          {errors.response ? (
            <p
              id={responseErrorId}
              role="alert"
              className="text-sm text-orange"
            >
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
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
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
            className="mt-2 w-full resize-y rounded-lg border border-beige bg-cream px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ocean focus:bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Escreva aqui sua mensagem (opcional)."
          />
          <p className="mt-1 text-right text-xs text-ink-soft">
            {values.message.length}/256
          </p>
        </div>
      </div>

      <div data-anim="rsvp-field" className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          data-status={status}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ocean px-6 py-3 font-semibold text-cream transition-all duration-200 hover:bg-ink hover:scale-[1.01] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70 disabled:hover:scale-100 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
              />
              Enviando...
            </>
          ) : (
            "Enviar resposta"
          )}
        </button>
      </div>

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[3.5rem]"
      >
        {status === "success" ? (
          <p
            role="alert"
            className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            Sua confirmação de presença foi enviada com sucesso! Obrigado por
            celebrar esse momento conosco.
          </p>
        ) : null}
        {status === "error" ? (
          <p
            role="alert"
            className="rounded-lg border border-orange/40 bg-orange/5 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            Não foi possível processar sua resposta agora. Verifique os campos
            destacados e tente novamente.
          </p>
        ) : null}
      </div>
    </form>
  );
}