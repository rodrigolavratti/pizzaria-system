const AdminDashboardPage = () => {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
              Pizzaria System
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Gestão de pizzas</h1>
            <p className="mt-2 text-neutral-400">
              Cadastre e gerencie os produtos do cardápio.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white opacity-60"
            title="A ação será habilitada na próxima etapa"
          >
            Nova pizza
          </button>
        </header>

        <section
          aria-labelledby="pizzas-title"
          className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
        >
          <div className="border-b border-neutral-800 px-6 py-5">
            <h2 id="pizzas-title" className="text-lg font-semibold">
              Pizzas cadastradas
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              A listagem será conectada ao Firestore em uma próxima etapa.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-neutral-800/60 text-neutral-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Preço
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Disponibilidade
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-neutral-400"
                  >
                    A tabela será preenchida quando conectarmos o painel ao
                    Firestore.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
