import React from "react";

export default function ContactStep({ contact, onChange, errors }) {
  const fieldError = (field) =>
    errors?.find((e) => e.toLowerCase().startsWith(field));

  return (
    <div className="animate-riseIn space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Almost there</h2>
        <p className="mt-1 text-slate-600">
          Tell us where to send the estimate and we'll calculate your range.
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-base font-semibold text-slate-900"
        >
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={contact.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-base
            focus:outline-none focus:border-copper-500 transition-colors"
          placeholder="Jane Homeowner"
        />
        {fieldError("name") && (
          <p className="mt-1 text-sm text-red-500">{fieldError("name")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-base font-semibold text-slate-900"
        >
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          value={contact.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-base
            focus:outline-none focus:border-copper-500 transition-colors"
          placeholder="(614) 555-0148"
        />
        {fieldError("phone") && (
          <p className="mt-1 text-sm text-red-500">{fieldError("phone")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-base font-semibold text-slate-900"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={contact.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-base
            focus:outline-none focus:border-copper-500 transition-colors"
          placeholder="jane@example.com"
        />
        {fieldError("email") || fieldError("a valid") ? (
          <p className="mt-1 text-sm text-red-500">
            {fieldError("email") || fieldError("a valid")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
