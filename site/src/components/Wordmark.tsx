export function Wordmark() {
  return (
    <>
      <img
        src="/logo_humation.svg"
        alt="Humation"
        width={102}
        height={16}
        className="h-3.5 w-auto dark:hidden"
      />
      <img
        src="/logo_humation_dk.svg"
        alt=""
        width={102}
        height={16}
        className="hidden h-3.5 w-auto dark:block"
      />
    </>
  )
}
