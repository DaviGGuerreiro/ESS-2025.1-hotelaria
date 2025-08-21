import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Mapeamento de Páginas (Boa prática para manutenção) ---
const pageMap = {
  Home: "/home",
  Perfil: "/perfil",
  "edição de perfil": "/perfil/editar",
  login: "/",
};

const testUser = {
  CPF: "11122233344",
  Email: "ficticio@exemplo.com",
  Password: "senhaSegura123",
  Name: "Nome Fictício do Usuário",
};

Given("que o usuário de CPF {string} está logado e na página {string}", (cpf, pageName) => {
    cy.request({
      method: 'POST',
      url: 'localhost:2000/login',
      body: { Email: testUser.Email, Password: testUser.Password },
    });
    // Após o login (e o cookie ser setado), visita a página de destino
    const url = pageMap[pageName];
    cy.visit(url);
    cy.contains('button', 'Sair', { timeout: 10000 }).should('be.visible');
  }
);

When("o usuário clica no link {string}", (linkText) => {
  // cy.contains encontra um elemento pelo seu texto
  cy.contains('a', new RegExp(`^${linkText}$`, 'i')).click();
});

When("o usuário clica no botão {string}", (buttonText) => {
  cy.get(`[data-cy="${buttonText.toLowerCase().replace(' ', '-')}"]`).click();
});

When("o usuário altera o campo {string} para {string} e clica no botão {string}", (fieldLabel, newValue, buttonText) => {z
    cy.contains('label', fieldLabel).find('input').clear().type(newValue);
    cy.contains('button', buttonText).click();
  }
);

When("o usuário apaga o conteúdo do campo {string} e clica no botão {string}", (fieldLabel, buttonText) => {
    cy.contains('label', fieldLabel).find('input').clear();
    cy.contains('button', buttonText).click();
  }
);

When("o usuário clica no botão {string} e confirma a ação", (buttonText) => {
  cy.on('window:confirm', () => true);
  cy.contains('button', buttonText).click();
});

Then("ele é redirecionado para a página {string}", (pageName) => {
  const url = pageMap[pageName];
  cy.url().should("include", url);
});

Then("ele é redirecionado para a página {string} e visualiza seus dados cadastrados", (pageName) => {
    cy.contains('h1', 'Perfil do Usuário', { timeout: 10000 }).should('be.visible');
    const url = pageMap[pageName];
    cy.url().should("include", url);
    cy.get('@userData').then((user) => {
        cy.contains(user.name);
    });
  }
);

Then("ele é redirecionado para a página {string} e seus dados aparecem atualizados", (pageName) => {
    const url = pageMap[pageName];
    cy.url().should("include", url);
    cy.contains("Usuario Editado");
  }
);

Then("uma mensagem de erro {string} é exibida", (errorMessage) => {
  cy.get('.error').should('contain', errorMessage);
});

Then("ele é redirecionado para a página {string} e sua conta é removida do sistema", (pageName) => {
    const url = pageMap[pageName];
    cy.url().should("include", url);
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      body: { email: testUser.email, password: testUser.password },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401, 404]);
    });
  }
);
