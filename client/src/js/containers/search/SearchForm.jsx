/* global window, document */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import PlacesAutocomplete from 'react-places-autocomplete';
import {loadComponent, provideInjector} from 'lib/Injector';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';

import {fetchLocations} from 'actions/locationActions';
import {search} from 'actions/searchActions';
import {changePage} from 'actions/listActions';

export class SearchForm extends Component {
  /**
   * Turns a javascript object into url params.
   * Skips keys without values
   *
   * @param obj
   * @return {string}
   */
  static objToUrl(obj) {
    let vars = '';

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      // don't add it if its blank
      if (value !== undefined && value !== null && value !== '') {
        vars += `${key}=${value}&`;
      }
    });

    // replaces trailing spaces and '&' symbols then replaces spaces with +
    return vars.replace(/([&\s]+$)/g, '').replace(/(\s)/g, '+');
  }

  static getDropdownValue(name) {
    if (document.getElementsByName(name)[0] !== undefined) {
      return document.getElementsByName(name)[0].value;
    }
    return '';
  }

  /**
   * Used to create the SearchBar.
   * needed to allow use of this keyword in handler.
   * @param props
   */
  constructor(props) {
    super(props);

    this.searchAddress = props.address;

    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  /**
   * 'Submits' form. Really just fires state change and changes the url.
   */
  handleSubmit(data, action) {
    console.log(data);

    const params = Object.keys(data).reduce((object, key) => {
      if (!key.startsWith('action_')) {
        object[key] = data[key]
      }
      return object
    }, {});

    console.log(params);

    // selects dispatch and unit from this.props.
    // const dispatch = this.props.dispatch; const unit = this.props.unit;
    const {dispatch, unit} = this.props;

    // dispatches search (updates search values)
    dispatch(search(params));

    // dispatches fetch locations (gets the locations)
    dispatch(fetchLocations({
      ...params,
      unit,
    }));

    dispatch(changePage(1));

    // changes the url for the window and adds it to the browser history(no redirect)
    const loc = window.location;
    const newurl = `${loc.protocol}//${loc.host}${loc.pathname}?${SearchForm.objToUrl(params)}`;
    window.history.pushState({
      path: newurl,
    }, '', newurl);
  }

  handleAddressChange(searchAddress) {
    this.searchAddress = searchAddress;
  }

  getRadiiSource() {
    const {radii, unit} = this.props;
    return radii.map(radius => ({
      value: radius,
      title: `${radius} ${unit}`,
    }));
  }

  getCategorySource() {
    const {categories} = this.props;
    return categories.map(category => ({
      value: category.ID,
      title: category.Name,
    }));
  }

  /**
   * Gets the address input.
   * @return {*}
   */
  getAddressInput() {
    const {address, radii, center, autocomplete} = this.props;
    if (autocomplete === true) {
      const inputProps = {
        value: this.searchAddress,
        onChange: this.handleAddressChange,
        placeholder: ss.i18n._t('Locator.ADDRESS_FIELD', 'Address or zip code'),
        name: 'address',
      };
      const cssClasses = {
        root: 'form-control autocomplete-root',
        input: 'form-control',
      };
      const options = {
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: Math.max(...radii),
      };
      return (<PlacesAutocomplete
        inputProps={inputProps}
        classNames={cssClasses}
        onSelect={this.handleSubmit}
        onEnterKeyDown={this.handleSubmit}
        options={options}
      />);
    }
    return (<input
      type="text"
      name="address"
      className="form-control"
      placeholder={ss.i18n._t('Locator.ADDRESS_FIELD', 'Address or zip code')}
      defaultValue={address}
    />);
  }

  /**
   * Renders the component.
   * @returns {XML}
   */
  render() {
    const {identifier, formSchemaUrl} = this.props;
    return (
      <div>
        {formSchemaUrl &&
        <FormBuilderLoader
          identifier={identifier}
          schemaUrl={formSchemaUrl}
          onSubmit={(data, action) => {
            this.handleSubmit(data, action);
            return Promise.resolve();
          }}
        />
        }
      </div>
    );
    /*
    const {
      address, category, autocomplete
    } = this.props;

    const categories = this.getCategorySource();
    const showCategories = categories.length !== 0;

    const radii = this.getRadiiSource();
    let {radius} = this.props;
    if (typeof radius === 'string') {
      radius = Number(radius);
    }

    const SingleSelectField = loadComponent('SingleSelectField');

    return (
      <form onSubmit={this.handleSubmit} className="search">
        <div className="fieldset">
          <div className="address-input form-group">
            <label htmlFor="address"
                   className="sr-only">{ss.i18n._t('Locator.ADDRESS_FIELD', 'Address or zip code')}</label>
            {this.getAddressInput()}
          </div>
          <SingleSelectField
            name={ss.i18n._t('Locator.RADIUS_FIELD', 'Radius')}
            extraClass="radius-dropdown"
            value={radius}
            source={radii}
            data={{
              hasEmptyDefault: true,
              emptyString: ss.i18n._t('Locator.RADIUS_FIELD', 'Radius'),
            }}
          />
          {showCategories &&
            <SingleSelectField
              name={ss.i18n._t('Locator.CATEGORY_FIELD', 'Category')}
              extraClass="category-dropdown"
              defaultValue={category}
              source={categories}
              data={{
                hasEmptyDefault: true,
                emptyString: ss.i18n._t('Locator.CATEGORY_FIELD', 'Category'),
              }}
            />
          }
          <div className="form-group input-group-btn">
            <button
              className="btn btn-secondary"
              type="button"
              type="submit">
              <FontAwesomeIcon icon={faSearch}/>
              <span className="sr-only sr-only-focusable">{ss.i18n._t('Locator.SEARCH_BUTTON', 'Search')}</span>
            </button>
          </div>
        </div>
      </form>
    );*/
  }
}

SearchForm.propTypes = {
  address: PropTypes.string.isRequired,
  radius: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  category: PropTypes.string.isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  radii: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  categories: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  unit: PropTypes.string.isRequired,
  autocomplete: PropTypes.bool.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

/**
 * Takes variables/functions from the state and assigns them to variables/functions in the components props.
 *
 * @param state
 * @returns {{address, radius}}
 */
export function mapStateToProps(state) {
  return {
    // the defaults - for when it gets loaded from the url
    address: state.locator.search.address,
    radius: state.locator.search.radius,
    category: state.locator.search.category,

    // the options
    radii: state.locator.settings.radii,
    categories: state.locator.settings.categories,

    // other
    unit: state.locator.settings.unit,
    autocomplete: state.locator.settings.autocomplete,
    center: state.locator.settings.defaultCenter,
    identifier: 'Locator.SearchForm',
    formSchemaUrl: state.config.absoluteBaseUrl + state.config.url + '/schema',
  };
}

export default compose(
  connect(mapStateToProps),
  // for FormBuilderLoader
  provideInjector
)(SearchForm);
