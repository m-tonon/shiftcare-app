export function LoginHeroBackdrop() {
  return (
    <>
      <img
        src="/hero-caregiver.jpg"
        alt="Healthcare professional"
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,20,40,0.25) 0%, rgba(10,20,40,0.15) 40%, rgba(10,20,40,0.72) 70%, rgba(10,20,40,0.92) 100%)',
        }}
      />
    </>
  );
}
