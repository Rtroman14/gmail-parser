class Helpers {
    decodeBase64 = (encodedData) => {
        const attachmentBuffer = Buffer.from(encodedData, "base64");

        return attachmentBuffer.toString("utf-8");
    };

    uniqueCoordinates = (coordinates) => {
        const uniqueSet = new Set(coordinates.map(JSON.stringify));
        return Array.from(uniqueSet).map(JSON.parse);
    };

    fetchStormSwaths = (storm, HAIL_SIZE, WIND_SPEED) => {
        try {
            let extendedData = storm.ExtendedData[0].Data;
            extendedData = extendedData.map((el) => ({
                name: el.$.name,
                value: el.value[0],
            }));

            const coordinateString =
                storm.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];

            const coordinates = coordinateString.split(" ").map((coord) => {
                const [lon, lat] = coord.split(",").map(parseFloat);
                return { lat, lon };
            });

            let meetsCriteria = false;

            for (let data of extendedData) {
                if (data.name === "hailSize" && data.value >= HAIL_SIZE) {
                    meetsCriteria = true;
                }
                if (data.name === "windSpeed" && data.value >= WIND_SPEED) {
                    meetsCriteria = true;
                }
            }

            if (meetsCriteria) {
                return coordinates;
            }

            return false;
        } catch (error) {
            console.error(`Helpers > fetchStormSwaths() -- ${error.message}`);

            return false;
        }
    };

    fetchStormSwathsHailRecon = (storm, HAIL_SIZE, WIND_SPEED) => {
        let allCoordinates = [];

        try {
            const polygons = storm.MultiGeometry[0].Polygon;

            for (let polygon of polygons) {
                if ("outerBoundaryIs" in polygon) {
                    let coordinates = [];

                    const coordinatesString =
                        polygon.outerBoundaryIs[0].LinearRing[0].coordinates[0];

                    const coordinatesArray = coordinatesString.split("\r\n");

                    coordinatesArray.forEach((coordinate) => {
                        const [lat, long] = coordinate.split(",");

                        coordinates.push([lat, long]);
                    });

                    coordinates = this.uniqueCoordinates(coordinates);

                    allCoordinates = [...allCoordinates, ...coordinates];
                }
            }

            allCoordinates = this.uniqueCoordinates(allCoordinates);

            allCoordinates = allCoordinates.map((coord) => {
                const [lon, lat] = coord;
                return { lat, lon };
            });

            return allCoordinates;
        } catch (error) {
            console.error(`Helpers > fetchStormSwaths() -- ${error.message}`);

            return false;
        }
    };

    wait = (minutes) => new Promise((res) => setTimeout(res, minutes * 60 * 1000));
}

module.exports = new Helpers();
