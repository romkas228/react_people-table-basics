import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { getPeople } from '../../api';
import { Person } from '../../types';
import { PersonLink } from '../PersonLink';

export const PeoplePage = () => {
  const [peopleIsLoading, setPeopleIsLoading] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setPeopleIsLoading(true);

    getPeople()
      .then((response) => {
        return response.map(person => ({
          ...person,
          mother: response.find(mother => mother.name === person.motherName),
          father: response.find(father => father.name === person.fatherName),
        }))
      })
      .then(setPeople)
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setPeopleIsLoading(false);
        console.log(people);
      });
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {peopleIsLoading && <Loader />}

          {!peopleIsLoading && error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!peopleIsLoading && !error && !people.length && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!peopleIsLoading && !error && people.length && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  return (
                    <PersonLink person={person} key={person.slug}/>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
