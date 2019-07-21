import * as THREE from 'three';

class CountryInfoMapper {
    constructor(elementCreator) {
        this.elementCreator = elementCreator;
    }

    map(countriesInfo) {
        const lonFudge = Math.PI * 1.5;
        const latFudge = Math.PI;
        const lonHelper = new THREE.Object3D();
        const latHelper = new THREE.Object3D();
        lonHelper.add(latHelper);
        const positionHelper = new THREE.Object3D();
        positionHelper.position.z = 1;
        latHelper.add(positionHelper);

        for (const countryInfo of countriesInfo) {
            const { lat, lon, min, max, name } = countryInfo;

            lonHelper.rotation.y = THREE.Math.degToRad(lon) + lonFudge;
            latHelper.rotation.x = THREE.Math.degToRad(lat) + latFudge;

            positionHelper.updateWorldMatrix(true, false);
            const position = new THREE.Vector3();
            positionHelper.getWorldPosition(position);
            countryInfo.position = position;

            const width = max[0] - min[0];
            const height = max[1] - min[1];
            const area = width * height;
            countryInfo.area = area;

            const elem = this.elementCreator.create('div');
            elem.textContent = name;
            countryInfo.elem = elem;
        }

        return countriesInfo;
    }
}

export default CountryInfoMapper;