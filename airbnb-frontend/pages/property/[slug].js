import { sanityClient } from "../../sanity";
import { isMultiple } from "../../utils";

const Property = ({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerNight,
  beds,
  bedrooms,
  description,
  host,
  reviews,
}) => {

  const reviewAmount = reviews.length;
  return (
    <div className="container">
      <h1><b>{title}</b></h1>
      <h2><b>{propertyType} hosted by {host?.name}</b></h2>
      <h4>{bedrooms} bedroom{isMultiple(bedrooms)} * {beds} bed{isMultiple(beds)}</h4>
      <hr />
      <h4><b>Enhanced Clean</b></h4>
      <p>This host is committed to Airbnbs 5-step enhanced cleaning process</p>
      <h4><b>Amenities for everyday living</b></h4>
      <p>The host has equipped this place for long stays</p>
      <h4><b>House rules</b></h4>
      <p>This place suitable for pets and the host does not allow</p>

      <div className="price-box">
        <h2>R${pricePerNight}</h2>
        <h4>{reviewAmount} review{isMultiple(reviewAmount)}</h4>
        <div className="button" onClick={() => {}}>Change Dates</div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title,
    location,
    propertyType,
    mainImage,
    images,
    pricePerNight,
    beds,
    bedrooms,
    description,
    host->{
      _id,
      name,
      slug,
      image
    },
    reviews[]{
      ...,
      traveller->{
        _id,
        name,
        slug,
        image
      }
    }
  }`;

  const property = await sanityClient.fetch(query, { pageSlug });

  if (!property) {
    return {
      props: null,
      notFound: true,
    };
  } else {
    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage,
        images: property.images,
        pricePerNight: property.pricePerNight,
        beds: property.beds,
        bedrooms: property.bedrooms,
        description: property.description,
        host: property.host,
        reviews: property.reviews,
      },
    };
  }
};

export default Property;
