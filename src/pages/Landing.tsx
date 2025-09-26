import type React from 'react';
import { fakeProjects } from '../data/projects';
import { Card } from '../components/CardProperty';

/**
 * Page d'accueil : affiche une sélection de projets.
 * @returns Un nœud React.
 */
export default function Landing(): React.ReactNode {
  /**
   * Retourne les `n` premiers éléments du tableau.
   */
  const cardsVisible = fakeProjects.slice(0, 3);

  return (
    <div>
      <h2 className='text-2xl'>Some projects</h2>
      <p>Some of your projects</p>

      <div className='grid gap-[20px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'>
        {cardsVisible.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            title={p.title}
            type={p.type}
            size={p.size}
            fundingRequired={p.fundingRequired}
            situated={p.situated}
            status={p.status}
            tag={p.tag}
            image={p.image}
          />
        ))}
      </div>
    </div>
  );
}
