const AdminPage = () => {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
          Pizzaria System
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Painel administrativo
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-400">
          Esta será a área de gestão do cardápio. Nas próximas etapas,
          adicionaremos o login e as ferramentas para administrar as pizzas.
        </p>

        <section className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold">Gestão de pizzas</h2>
          <p className="mt-2 text-sm text-neutral-400">
            A listagem e o formulário de cadastro serão montados depois.
          </p>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
