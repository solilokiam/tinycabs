describe('TinyCab dashboard', () => {
    it('displays dashboard and list with no filters', () => {
        cy.visit('/');
        cy.get('#operations tr').should('have.length', 50)
        cy.get('#travels').should('not.have.text', '0');
        cy.get('#distance').should('not.have.text', '0');
        cy.get('#amount').should('not.have.text', '0');
    })

    it('filters by vendor', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000)
        cy.get('#vendor option').should('have.length', 3)
        cy.get("#vendor").select('1');
        cy.get("#filterBtn").click();
        cy.get('#travels').should('not.have.text', '0');
        cy.get('#distance').should('not.have.text', '0');
        cy.get('#amount').should('not.have.text', '0');
        cy.get('#operations tr').should('not.have.text', 'No rides found');

        cy.get('#operations > tr > td:nth-child(1)').each(
            (el) => {
                expect(el).to.have.text('1');
            }
        );

        cy.get("#vendor").select('2');
        cy.get("#filterBtn").click();
        cy.get('#travels').should('not.have.text', '0');
        cy.get('#distance').should('not.have.text', '0');
        cy.get('#amount').should('not.have.text', '0');
        cy.get('#operations tr').should('not.have.text', 'No rides found');

        cy.get('#operations > tr > td:nth-child(1)').each(
            (el) => {
                expect(el).to.have.text('2');
            }
        );
    })

    it('filters by future date', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.get('#startFilter').type('2046-01-01');
        cy.get('#endFilter').type('2047-01-01');
        cy.get("#filterBtn").click();
        cy.url().should('contain', 'start=2046-01-01');
        cy.url().should('contain', 'end=2047-01-01');
        cy.get('#travels').should('have.text', '0');
        cy.get('#distance').should('have.text', '0');
        cy.get('#amount').should('have.text', '0');
        cy.get('#operations tr').should('have.text', 'No rides found');
    })

    it('filters by present date', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.get('#startFilter').type('2017-01-01');
        cy.get('#endFilter').type('2017-02-01');
        cy.get("#filterBtn").click();
        cy.url().should('contain', 'start=2017-01-01');
        cy.url().should('contain', 'end=2017-02-01');
        cy.get('#operations tr').should('have.length', 50)
        cy.get('#travels').should('not.have.text', '0');
        cy.get('#distance').should('not.have.text', '0');
        cy.get('#amount').should('not.have.text', '0');
    })

    it('filters with wrong filter values', () => {
        cy.visit('/?vendor=-1&start=-01-01&end=200601');
        cy.get('#travels').should('contain', '0');
        cy.get('#operations tr').should('have.length', 0)
    });

    it('filters with empty value', () => {
        cy.visit('/?vendor=-1&start=2046-01-01&end=2046-06-01');
        cy.get('#travels').should('have.text', '0');
        cy.get('#distance').should('have.text', '0');
        cy.get('#amount').should('have.text', '0');
        cy.get('#operations tr').should('have.text', 'No rides found')
    })
});
