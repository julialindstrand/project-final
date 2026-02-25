import styled from "styled-components"

export const CatCard = ({ cat }) => {
  const { name, imageUrl, gender, location, createdAt } = cat

  return (
    <CardContainer>
      <ImgWrapper>
        <CatImg src={imageUrl} alt={`${name} photo`} />
      </ImgWrapper>

      <Info>
        <Name>{name}</Name>
        <Tags>
          <Tag>{gender}</Tag>
          <Tag>{location}</Tag>
        </Tags>
      </Info>
    </CardContainer>
  )
}


const CardContainer = styled.article`
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImgWrapper = styled.div`
  width: 100%;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CatImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
`

const Name = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
  color: black;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
`

const Tag = styled.span`
  border: 1px solid black;
  color: black;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 15px;
`