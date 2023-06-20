import { Component } from 'react';
import { BreedSelect } from './BreedSelect/BreedSelect';
import { fetchDogByBreed } from 'api';
import { Dog } from './Dog/Dog';
import { ImageLoader } from './DogSkeleton/DogSkeleton';

export class App extends Component {
  abortCtrl;

  state = {
    dog: null,
    isLoading: false,
    error: null,
  };

  fetchDog = async breedId => {
    if (this.abortCtrl) {
      this.abortCtrl.abort();
    }
    this.abortCtrl = new AbortController();
    try {
      this.setState({ isLoading: true, error: null });
      const fetchedDog = await fetchDogByBreed({
        breedId,
        abortCtrl: this.abortCtrl,
      });
      this.setState({ dog: fetchedDog });
    } catch (error) {
      if (error.code !== 'ERR_CANCELED') {
        this.setState({ error: 'oops...try again' });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { dog, isLoading, error } = this.state;
    return (
      <div
        style={{
          padding: '50px',
        }}
      >
        <BreedSelect onSelect={this.fetchDog} />

        {isLoading && <ImageLoader/>}
        {dog && !isLoading && <Dog dog={dog} />}
        {error && <p>{error}</p>}
      </div>
    );
  }
}
