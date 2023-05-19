def get_stores():
    type = "department_store"
    query = "Walmart"
    location = "New York"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}+in+{location}&type={type}&key={google_api_key}"
    
    response = requests.get(url)
    data = response.json()
    walmartStores = data["results"]
    
    walmartLocations = [
        {
            "name": store["name"],
            "address": store["formatted_address"],
            "latitude": store["geometry"]["location"]["lat"],
            "longitude": store["geometry"]["location"]["lng"],
        }
        for store in walmartStores
    ]

    return walmartLocations

def find_nearest_driver(customer_id, customer_lat, customer_lng):
    customer_location = Location.query.filter_by(customer_id=customer_id).first()

    if not customer_location:
        return None

    drivers = Driver.query.all()
    nearest_driver = None
    shortest_distance = None

    for driver in drivers:
        driver_location = Location.query.filter_by(driver_id=driver.id).first()

        if not driver_location:
            continue

        distance_to_customer = crud.calculate_distance(
            customer_lat, customer_lng, driver_location.latitude, driver_location.longitude
        )

        if shortest_distance is None or distance_to_customer < shortest_distance:
            shortest_distance = distance_to_customer
            nearest_driver = driver

    return nearest_driver


def find_nearest_walmart(customer_lat, customer_lng):
    walmart_locations = get_stores()
    shortest_distance = None
    nearest_walmart = None

    for walmart in walmart_locations:
        distance_to_walmart = crud.calculate_distance(
            customer_lat, customer_lng, walmart["latitude"], walmart["longitude"]
        )

        if shortest_distance is None or distance_to_walmart < shortest_distance:
            shortest_distance = distance_to_walmart
            nearest_walmart = walmart

    return nearest_walmart

@app.route("/api/places", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_places():
    customer_id = request.json.get("customerId")
    lat = request.json.get("latitude")
    lng = request.json.get("longitude")

    directions = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
    existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()
    if existing_location:
        nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
        nearest_walmart_location = find_nearest_walmart(lat, lng)

        return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
            "directions":get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
        }

    location = Location(customer_id=customer_id, latitude=lat, longitude=lng)
    db.session.add(location)
    db.session.commit()

    nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
    nearest_walmart_location = find_nearest_walmart(lat, lng)

    if not nearest_walmart_location:
        return {
            "error": "No Walmart locations found",
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": None
        }

    return {
        "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
        "walmart_location": nearest_walmart_location,
        "directions":directions["directions"],
        "estimated_time": directions["estimated_time"]
    }

def calculate_distance(lat1, lon1, lat2, lon2):
    # approximate radius of earth in km
    R = 6373.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance


def get_directions(driver, walmart):
    driver_lat = driver["location"]["latitude"]
    driver_lng = driver["location"]["longitude"]
    walmart_lat = walmart["latitude"]
    walmart_lng = walmart["longitude"]

    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={driver_lat},{driver_lng}&destination={walmart_lat},{walmart_lng}&key={google_api_key}"
    response = requests.get(url)
    data = response.json()

    if "routes" not in data or len(data["routes"]) == 0:
        return None

    route = data["routes"][0]
    legs = route["legs"]

    total_duration = sum([leg["duration"]["value"] for leg in legs])  # Sum of durations of all legs

    estimated_time = datetime.timedelta(seconds=total_duration)

    return {
        "estimated_time": str(estimated_time),
        "directions": data
    }


# @app.route("/update_driver_location", methods=["PATCH"])
# def updateDriver():
#     driver_id = request.json.get("id")
#     driver_location = request.json.get("driverLocation")

#     driver = Driver.query.get(driver_id).first()

#     driver.location.latitude = driver_location["latitude"]
#     driver.location.longtitude = driver_location["longitude"]

#     db.session.add(driver)
#     db.session.commit()

#     return driver.to_dict()


# def get_stores():
#     stores = Store.query.all()

#     walmartLocations = [
#         {
#             "name": store.name,
#             "address": store.address,
#             "latitude": store.latitude,
#             "longitude": store.longitude,
#         }
#         for store in stores
#     ]

#     return walmartLocations


# class Store(db.Model):
#     __tablename__ = 'stores'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String)
#     address = db.Column(db.Text)
#     latitude = db.Column(db.Float)
#     longitude = db.Column(db.Float)

#     def __init__(self, name, address, latitude, longitude):
#         self.name = name
#         self.address = address
#         self.latitude = latitude
#         self.longitude = longitude