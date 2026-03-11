import { Check, X } from 'lucide-react';

/**
 * Componente que muestra los requisitos de contraseña con validación en tiempo real
 * Los requisitos se colorean en verde (cumplido) o rojo (incumplido)
 */
export const PasswordRequirements = ({ password = '' }) => {
  const requirements = [
    {
      label: 'Mínimo 8 caracteres',
      met: password.length >= 8,
    },
    {
      label: 'Al menos una letra mayúscula',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Al menos una letra minúscula',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Al menos un número',
      met: /[0-9]/.test(password),
    },
    {
      label: 'Al menos un carácter especial (@$!%*#?&)',
      met: /[@$!%*#?&]/.test(password),
    },
  ];

  const allMet = requirements.every((req) => req.met);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-sm transition-colors ${
              requirement.met
                ? 'text-green-600'
                : password.length > 0
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {requirement.met ? (
              <Check className="h-4 w-4 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{requirement.label}</span>
          </div>
        ))}
      </div>

      {allMet && password.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2 text-sm text-green-700 font-medium">
          ✓ Contraseña válida
        </div>
      )}
    </div>
  );
};
