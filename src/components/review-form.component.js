import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import MDEditor from '@uiw/react-md-editor';
import reviewService from "../services/review.service";
import '../styles.css'
import Dropzone from "react-dropzone-uploader";
import imageService from "../services/image.service";
import {WithContext as ReactTags} from 'react-tag-input';
import tagService from "../services/tag.service";
import { Rating } from 'react-simple-star-rating'
import categoryService from "../services/category.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class ReviewFormComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeFull_text = this.onChangeFull_text.bind(this);
        this.handleRating = this.handleRating.bind(this);
        this.handlePostReview = this.handlePostReview.bind(this);
        this.handleDeleteTag = this.handleDeleteTag.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleDragTag = this.handleDragTag.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.state = {
            title: "",
            category: "",
            full_text: "",
            loading: false,
            message: "",
            successful: false,
            images: [],
            initialImages: [],
            imageUrls: [],
            tags: [],
            isLoaded: false,
            categories: [],
            suggestions: [],
            rating: 0
        };
    }

    componentDidMount() {
        categoryService.getAllCategories().then(r => {
            this.setState({
                categories : r.data,
                category: r.data[0].name
            })
        });
        tagService.getAllTags().then(r => {
            this.setState({
                suggestions : r.data.map((tag) => {
                    return {"id": tag.name, "text": tag.name}
                })
            })
        });
        if (this.props.match.params.id) {
            reviewService.getReview(this.props.match.params.id).then((response) => {
                let review = response.data;
                this.setState({
                    title: review.title,
                    category: review.category,
                    full_text: review.full_text,
                    imageUrls: review.imageUrls,
                    tags: review.tags.map((tag) => {
                        return {"id": tag, "text": tag}
                    })
                });
                if (this.state.imageUrls.length) {
                    const promises = Promise.all(this.state.imageUrls.map(imageUrl => {
                        return fetch(imageUrl)
                    }));

                    promises.then((results) => {
                        Promise.all(results.map((r, index) => {
                            r.arrayBuffer().then(buf => {
                                const file = new File([buf], 'image_data_url' + index + '.jpg', {type: 'image/jpeg'})
                                this.state.initialImages.push(file)
                            }).then(() => {
                                if (this.state.initialImages.length === this.state.imageUrls.length)
                                    this.setState({
                                        isLoaded: true
                                    });
                            })
                        }))
                    })
                } else this.setState({
                    isLoaded : true
                })
            })
        }
        else this.setState({
            isLoaded : true
        })
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeCategory(e) {
        this.setState({
            category: e.target.value
        });
    }

    onChangeFull_text(value) {
        this.setState({
            full_text: value
        });
    }

    handleRating(rate) {
        this.setState({
            rating: rate
        });
    }

    postReview() {
        if (this.props.match.params.id)
            return reviewService.editReview(this.state.title, this.state.category, this.state.full_text, this.state.rating, this.state.imageUrls, this.state.tags, this.props.match.params.id);
        else
            return reviewService.addReview(this.props.match.params.author, this.state.title, this.state.category, this.state.full_text, this.state.rating, this.state.imageUrls, this.state.tags);
    }

    handlePostReview(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: true,
            successful: false
        });
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            let promises = [];
            this.setState({
                imageUrls: []
            })
            this.state.images.forEach(img => {
                promises.push(
                    imageService.upload(img).then(response => {
                        console.log(response.data)
                        this.state.imageUrls.push(response.data.secure_url)
                    })
                )
            })
            Promise.all(promises).then(() => {
                this.postReview().then(
                    (response) => {
                        this.setState({
                            message: response.data.message,
                            loading: false,
                            successful: true
                        });
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        this.setState({
                            loading: false,
                            successful: false,
                            message: resMessage
                        });
                    }
                );
            });

        } else {
            this.setState({
                loading: false
            });
        }
    }

    removeImage(file) {
        this.setState({
            images: this.state.images.filter(function (img) {
                return img !== file
            })
        });
    }

    handleDeleteTag(i) {
        this.setState({tags: this.state.tags.filter((tag, index) => index !== i)})
    }

    handleAddTag(tag) {
        this.setState({tags: [...this.state.tags, tag]});
    }

    handleDragTag(tag, currPos, newPos) {
        const newTags = this.state.tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({tags: newTags});
    }

    handleClickTag(index) {
        console.log('The tag at index ' + index + ' was clicked');
    };


    render() {
        const isLoaded = this.state.isLoaded;
        //const { file } = this.state.images
        const initialImages = this.state.initialImages
        const handleChangeStatus = ({meta, file}, status) => {
            // console.log(status, meta, file)
            if (status === "done") {
                this.setState(
                    {images: [...this.state.images, file]}
                )
                // console.log(this.state.images.length)
            }
            else if (status === "removed") {
                this.removeImage(file)
                // console.log(this.state.images.length)
            }
        }
        const KeyCodes = {
            comma: 188,
            enter: 13
        };
        const delimiters = [KeyCodes.comma, KeyCodes.enter];

        // console.log('here:', initialImages, initialImages.length)
        return (
            <div className="container mt-5 mb-5">

                <Form
                    onSubmit={this.handlePostReview}
                    ref={c => {
                        this.form = c;
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="title"
                            value={this.state.title}
                            onChange={this.onChangeTitle}
                            autoFocus={true}
                            validations={[required]}
                        />
                    </div>
                    <label htmlFor="rating">Your rating</label>
                    <Rating onClick={this.handleRating} ratingValue={this.state.rating} /* Available Props */ />
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            className="form-select"
                            value={this.state.category}
                            onChange={this.onChangeCategory}>
                            {this.state.categories.map((category, key) => {
                                return <option key = {key} value={category.name}>{category.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="full_text">Full text</label>
                        <MDEditor
                            name="full_text"
                            value={this.state.full_text}
                            onChange={this.onChangeFull_text}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <div className="app">
                            <div>
                                <ReactTags
                                    classNames={{
                                        tagInputField: 'form-control'
                                    }}
                                    tags={this.state.tags}
                                    suggestions={this.state.suggestions}
                                    delimiters={delimiters}
                                    handleDelete={this.handleDeleteTag}
                                    handleAddition={this.handleAddTag}
                                    handleDrag={this.handleDragTag}
                                    handleTagClick={this.handleClickTag}
                                    inputFieldPosition="bottom"
                                    autocomplete
                                    autofocus={false}
                                    validations={[required]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        {isLoaded ? (
                            <React.Fragment>
                                <label htmlFor="images">Put some images</label>
                                <Dropzone
                                    name="images"
                                    accept="image/*"
                                    onChangeStatus={handleChangeStatus}
                                    SubmitButtonComponent={null}
                                    autoUpload={false}
                                    initialFiles={initialImages}
                                />
                            </React.Fragment>
                        ) : (<div>Loading...</div>)}

                    </div>
                    <div className="form-group mt-2">
                        <button
                            className="btn btn-primary btn-block"
                            disabled={this.state.loading}
                        >
                            {this.state.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Post review</span>
                        </button>
                    </div>
                    {this.state.message && (
                        <div className="form-group">
                            <div className={
                                this.state.successful
                                    ? "alert alert-success"
                                    : "alert alert-danger"
                            } role="alert">
                                {this.state.message}
                            </div>
                        </div>
                    )}
                    <CheckButton
                        style={{display: "none"}}
                        ref={c => {
                            this.checkBtn = c;
                        }}
                    />
                </Form>
            </div>
        );
    }
}