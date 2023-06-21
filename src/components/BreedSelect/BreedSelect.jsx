import { fetchBreeds } from 'api';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export const BreedSelect = ({ onSelect }) => {
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = breeds.map(breed => {
    return {
      value: breed.id,
      label: breed.name,
    };
  });

  const abortCtrl = new AbortController();

  useEffect(() => {
    async function getBreeds() {
      try {
        setIsLoading(true);
        setError(null);

        const fetchedBreeds = await fetchBreeds(abortCtrl.signal);

        setBreeds(fetchedBreeds);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setError('Ooops.....something went wrong 😖 try to reload the page');
        }
      } finally {
        setIsLoading(false);
      }
    }
    getBreeds();

    return () => {
      //то же что и componentWillUnmount()
      abortCtrl.abort();
    };
  }, []);

  return (
    <div>
      <Select
        isLoading={isLoading}
        options={options}
        onChange={option => {
          onSelect(option.value);
        }}
      />
      {error && <p>{error}</p>}
      {/* {isloading && <p>Is loading.....😊</p>} */}
    </div>
  );
};

// export class BreedSelect extends Component {
//   abortCtrl;

//   state = {
//     breeds: [],
//     isloading: false,
//     error: null,
//   };
//   async componentDidMount() {
//     try {
//       this.abortCtrl = new AbortController();
//       this.setState({ isloading: true, error: null });
//       const fetchedBreeds = await fetchBreeds(this.abortCtrl);
//       this.setState({ breeds: fetchedBreeds });
//     } catch (error) {
//       if (error.code !== 'ERR_CANCELED') {
//         this.setState({
//           error: 'OOoops.....something went wrong 😖 try to reload the page',
//         });
//       }
//     } finally {
//       this.setState({ isloading: false });
//     }
//   }

//   componentWillUnmount() {
//     this.abortCtrl.abort();
//   }

//   render() {
//     const {onSelect} = this.props
//     const { breeds, isloading, error } = this.state;
//     const options = breeds.map(breed => {
//       return {
//         value: breed.id,
//         label: breed.name,
//       };
//     });
//     return (
//       <div>
//         <Select
//           isLoading={isloading}
//           options={options}
//           onChange={option => {
//             onSelect(option.value)
//           }}
//         />
//         {error && <p>{error}</p>}
//         {/* {isloading && <p>Is loading.....😊</p>} */}
//       </div>
//     );
//   }
// }
